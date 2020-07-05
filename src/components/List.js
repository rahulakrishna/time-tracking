import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import SearchIcon from '@material-ui/icons/Search';
import { toast } from 'react-toastify';
import { GET_ALL_TASKS } from 'queries/tasks';
import { DELETE_TASK, EDIT_TASK } from 'mutations/tasks';
import { ListContainer, ListItem } from 'styles';
import Tooltip from '@material-ui/core/Tooltip';
import useOnclickOutside from 'react-cool-onclickoutside';

const List = ({ setAuthenticated }) => {
  const { loading, error, data } = useQuery(GET_ALL_TASKS);
  useEffect(() => {
    if (error) {
      console.log({ error, code: error.graphQLErrors[0].extensions.code });
    }
    if (
      error &&
      (error.graphQLErrors[0].extensions.code === 'invalid-headers' ||
        error.graphQLErrors[0].extensions.code === 'invalid-jwt')
    ) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }, [error, setAuthenticated]);
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
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInput = useOnclickOutside(() => {
    setSearchMode(false);
    selectFilter(null);
  });
  const [selectedFilter, selectFilter] = useState(null);
  return (
    <ListContainer>
      <div style={{ width: '100%', textAlign: 'right' }}>
        {!searchMode ? (
          <IconButton aria-label="search" onClick={() => setSearchMode(true)}>
            <SearchIcon />
          </IconButton>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '100%',
            }}
            ref={searchInput}
          >
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                height: '40px',
                fontSize: '16px',
                paddingLeft: '8px',
                paddingRight: '8px',
                width: '50%',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <button
                onClick={() => selectFilter('inprogress')}
                style={{
                  background:
                    selectedFilter === 'inprogress'
                      ? 'rgb(14, 118, 210)'
                      : '#7cbbf3',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '8px',
                  marginRight: '8px',
                  color: '#fff',
                }}
              >
                in progress
              </button>
              <button
                onClick={() => selectFilter('notinprogress')}
                style={{
                  background:
                    selectedFilter === 'notinprogress'
                      ? 'rgb(14, 118, 210)'
                      : '#7cbbf3',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '8px',
                  marginRight: '8px',
                  color: '#fff',
                }}
              >
                not in progress
              </button>
            </div>
          </div>
        )}
      </div>
      {loading && 'Loading...'}
      {error && JSON.stringify(error)}
      {data && data.tasks.length === 0 && (
        <ListItem>Add a task using the input above!</ListItem>
      )}
      {data &&
        data.tasks
          .filter(t => {
            if (selectedFilter) {
              if (selectedFilter === 'inprogress') {
                if (searchTerm === '') {
                  return startedTasks.includes(t.id);
                } else {
                  return (
                    startedTasks.includes(t.id) &&
                    t.title.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }
              }
              if (selectedFilter === 'notinprogress') {
                if (searchTerm === '') {
                  return !startedTasks.includes(t.id);
                } else {
                  return (
                    !startedTasks.includes(t.id) &&
                    t.title.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }
              }
            } else if (searchTerm === '') {
              return true;
            } else {
              return t.title.toLowerCase().includes(searchTerm.toLowerCase());
            }
          })
          .map(task => (
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
