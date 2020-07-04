import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { toast } from 'react-toastify';
import { GET_ALL_TASKS } from 'queries/tasks';
import { DELETE_TASK, EDIT_TASK } from 'mutations/tasks';
import { ListContainer, ListItem } from 'styles';
import Tooltip from '@material-ui/core/Tooltip';
import useOnclickOutside from 'react-cool-onclickoutside';

const List = () => {
  const { loading, error, data } = useQuery(GET_ALL_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK, {
    update: (cache, response) => {
      if (response.data) {
        toast('Deleted!', { type: 'warning' });
        const { tasks } = cache.readQuery({
          query: GET_ALL_TASKS,
        });
        cache.writeQuery({
          query: GET_ALL_TASKS,
          data: {
            tasks: tasks.filter(
              t => t.id !== response.data.delete_tasks_by_pk.id,
            ),
          },
        });
      }
    },
    onError: e => {
      console.log({ e });
      toast('Something went wrong!', { type: 'error' });
    },
  });
  const [editTask] = useMutation(EDIT_TASK, {
    update: (cache, response) => {
      const { tasks } = cache.readQuery({
        query: GET_ALL_TASKS,
      });
      const indexOfTask = tasks.findIndex(
        t => t.id === response.data.update_tasks_by_pk.id,
      );
      let updatedTasks = tasks;
      updatedTasks.slice(indexOfTask, 1, response.data.update_tasks_by_pk);
      cache.writeQuery({
        query: GET_ALL_TASKS,
        data: {
          tasks: updatedTasks,
        },
      });
      setEditModeTask(null);
      setEditingTitle('');
    },
    onError: e => {
      toast('Something went wrong', {
        type: 'error',
      });
      console.log({ e });
    },
  });
  const [startedTasks, setStartedTasks] = useState([]);
  const [editModeTask, setEditModeTask] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInput = useOnclickOutside(() => {
    if (editingTitle !== '' && editModeTask !== null) {
      editTask({
        variables: {
          id: editModeTask,
          title: editingTitle,
        },
      });
    } else {
      setEditModeTask(null);
    }
  });
  useEffect(() => {
    console.log(localStorage);
    setStartedTasks(JSON.parse(localStorage.getItem('startedTasks')) || []);
  }, []);
  return (
    <ListContainer>
      {loading && 'Loading...'}
      {error && JSON.stringify(error)}
      {data && data.tasks.length === 0 && (
        <ListItem>Add a task using the input above!</ListItem>
      )}
      {data &&
        data.tasks.map(task => (
          <ListItem key={task.id}>
            <b style={{ width: '100%' }}>
              {editModeTask === task.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    editTask({
                      variables: {
                        id: editModeTask,
                        title: editingTitle,
                      },
                    });
                  }}
                  ref={editInput}
                  style={{ width: '100%' }}
                >
                  <input
                    className="task-title"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    autoFocus
                    rows="1"
                  />
                </form>
              ) : (
                <Tooltip title="Click to edit" arrow>
                  <button
                    className="task-title"
                    onClick={() => {
                      setEditModeTask(task.id);
                      setEditingTitle(task.title);
                    }}
                  >
                    {task.title}
                  </button>
                </Tooltip>
              )}
              {task.tags.map(t => (
                <span className="tag">{t.name}</span>
              ))}
            </b>
            <div className="actions">
              {startedTasks.includes(task.id) ? (
                <IconButton
                  aria-label="stop"
                  onClick={() => {
                    setStartedTasks(startedTasks.filter(s => s !== task.id));
                    localStorage.setItem(
                      'startedTasks',
                      JSON.stringify(startedTasks.filter(s => s !== task.id)),
                    );
                  }}
                >
                  <StopIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="start"
                  onClick={() => {
                    setStartedTasks([...startedTasks, task.id]);
                    localStorage.setItem(
                      'startedTasks',
                      JSON.stringify([...startedTasks, task.id]),
                    );
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="delete"
                onClick={() => deleteTask({ variables: { id: task.id } })}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
    </ListContainer>
  );
};

export default List;
