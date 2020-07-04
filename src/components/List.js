import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { toast } from 'react-toastify';
import { GET_ALL_TASKS } from 'queries/tasks';
import { DELETE_TASK } from 'mutations/tasks';
import { ListContainer, ListItem } from 'styles';

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
  return (
    <ListContainer>
      {loading && 'Loading...'}
      {error && JSON.stringify(error)}
      {data && data.tasks.length === 0 && (
        <ListItem>Add a task using the input above!</ListItem>
      )}
      {data &&
        data.tasks.map(task => (
          <ListItem>
            <b>
              {task.title}{' '}
              {task.tags.map(t => (
                <span className="tag">{t.name}</span>
              ))}
            </b>
            <div className="actions">
              <IconButton aria-label="start" onClick={() => {}}>
                <PlayArrowIcon />
              </IconButton>
              <IconButton aria-label="stop" onClick={() => {}}>
                <StopIcon />
              </IconButton>
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
