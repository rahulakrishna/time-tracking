import styled from 'styled-components';

export const AppContainer = styled.div`
  background: #fcfeec;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  div {
    width: 50%;
  }
`;

export const CreateTaskContainer = styled.form`
  width: 100%;
`;
export const TaskTitleInput = styled.input`
  font-family: 'Lato', sans-serif;
  width: 100%;
  font-size: 24px;
  border: 0;
  box-shadow: 0px 0.5px 0.4px 0px;
  margin: 20px 0px;
  padding: 20px 10px;
  &:focus {
    outline: none;
  }
  button {
    &:focus {
      outline: none;
    }
    &:active {
      outline: none;
    }
  }
`;

export const ListContainer = styled.ul`
  margin: 20px 0px;
  list-style: none;
  padding: 0px;
`;

export const ListItem = styled.li`
  background: #c5d3b1;
  color: #090909;
  font-size: 24px;
  width: 100%;
  margin: 20px 0px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .actions {
    text-align: right;
  }
  .tag {
    font-size: 12px;
    background: rgba(40, 50, 60, 0.5);
    border-radius: 8px;
    padding: 4px;
    color: #fff;
  }
`;
