import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { CREATE_TASK, CREATE_TASK_WITH_EXISTING_TAG } from 'mutations/tasks';
import { GET_ALL_TASKS, GET_ALL_TAGS } from 'queries/tasks';
import { CreateTaskContainer, TaskTitleInput } from 'styles';
import { toast } from 'react-toastify';
import useOnclickOutside from 'react-cool-onclickoutside';

const mutationUpdateFunction = (cache, response) => {
  const createdTask = {
    ...response.data.insert_tasks_one,
  };
  const { tasks } = cache.readQuery({
    query: GET_ALL_TASKS,
  });
  cache.writeQuery({
    query: GET_ALL_TASKS,
    data: {
      tasks: [...tasks, createdTask],
    },
  });
};

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [shouldShowTags, setShowTags] = useState(false);
  const [selectedTag, selectTag] = useState(null);
  const ref = useOnclickOutside(() => {
    selectTag(null);
    setShowTags(false);
  });
  const [createTask] = useMutation(CREATE_TASK, {
    update: (cache, response) => {
      mutationUpdateFunction(cache, response);
    },
    onCompleted: data => {
      setTitle('');
      selectTag(null);
      toast('Completed!', {
        type: 'success',
      });
    },
    onError: e => {
      console.log({ e });
      toast('Something went wrong', {
        type: 'error',
      });
    },
  });
  const [createTaskWithExistingTag] = useMutation(
    CREATE_TASK_WITH_EXISTING_TAG,
    {
      update: (cache, response) => {
        mutationUpdateFunction(cache, response);
      },
      onCompleted: data => {
        setTitle('');
        selectTag(null);
        toast('Completed!', {
          type: 'success',
        });
      },
      onError: e => {
        console.log({ e });
        toast('Something went wrong', {
          type: 'error',
        });
      },
    },
  );
  const { loading: tagsLoading, error: tagsError, data: tagsData } = useQuery(
    GET_ALL_TAGS,
  );
  return (
    <CreateTaskContainer
      onSubmit={e => {
        e.preventDefault();
        if (selectedTag) {
          createTaskWithExistingTag({
            variables: {
              title,
              tag_id: selectedTag,
            },
          });
        } else {
          createTask({
            variables: {
              title,
            },
          });
        }
      }}
      ref={ref}
    >
      <TaskTitleInput
        value={title}
        onChange={e => setTitle(e.target.value)}
        onFocus={() => setShowTags(true)}
        placeholder="What needs to be done?"
      />
      {tagsLoading && 'Loading tags'}
      {tagsError && JSON.stringify({ tagsError })}
      {shouldShowTags && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
            {tagsData &&
              tagsData.tags.map(tag => (
                <button
                  type="button"
                  style={{
                    color: '#fff',
                    background: selectedTag === tag.id ? 'red' : '#dc7070',
                    padding: '4px',
                    borderRadius: '4px',
                    margin: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    selectTag(tag.id);
                  }}
                >
                  {tag.name}
                </button>
              ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                color: '#fff',
                background: '#70dc70',
                padding: '4px',
                borderRadius: '4px',
                margin: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
              disabled={title === ''}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </CreateTaskContainer>
  );
};

export default CreateTask;
