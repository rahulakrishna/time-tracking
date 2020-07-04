import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_TASK } from "mutations/tasks";
import { GET_ALL_TASKS } from "queries/tasks";
import { CreateTaskContainer, TaskTitleInput } from "styles";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [scheduleMode, setScheduleMode] = useState(false);
  const [times, setTimes] = useState({
    startTime: "",
    endTime: ""
  });
  const [createTask] = useMutation(CREATE_TASK, {
    update: (cache, response) => {
      const createdTask = {
        ...response.data.insert_tasks_one
      };
      const { tasks } = cache.readQuery({
        query: GET_ALL_TASKS
      });
      cache.writeQuery({
        query: GET_ALL_TASKS,
        data: {
          tasks: [...tasks, createdTask]
        }
      });
    },
    onCompleted: data => {
      setTitle("");
      toast("Completed!", {
        type: "success"
      });
    },
    onError: e => {
      console.log({ e });
      toast("Something went wrong", {
        type: "error"
      });
    }
  });
  return (
    <CreateTaskContainer
      onSubmit={e => {
        e.preventDefault();
        createTask({
          variables: {
            title
          }
        });
      }}
    >
      <TaskTitleInput
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What needs to be done?"
      />
    </CreateTaskContainer>
  );
};

export default CreateTask;
