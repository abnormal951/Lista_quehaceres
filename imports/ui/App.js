import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Task from './Task.js';

// App component - represents the whole app
const App = ({ tasks, currentUser, incompleteCount }) => {
  const [hideCompleted, toggleHideCompleted] = useState(false);
  const textInput = useRef(null);

  const renderTasks = () => {
    let filteredTasks = tasks;
    hideCompleted &&
      (filteredTasks = filteredTasks.filter(task => !task.checked));
    return filteredTasks.map(task => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const inputField = textInput.current;
    const text = inputField.value.trim();
    Meteor.call('tasks.insert', text);
    inputField.value = '';
  };

  return (
    <>
      <nav id="nav-bar">Top Nav</nav>
      <div className="container">
        <header>
          <h1>Lista de Quehaceres ({incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={hideCompleted}
              onClick={() => toggleHideCompleted(!hideCompleted)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          {currentUser && (
            <form className="new-task" onSubmit={e => handleSubmit(e)}>
              <input
                type="text"
                ref={textInput}
                placeholder="Type to add new tasks"
              />
            </form>
          )}
        </header>
        {currentUser ? (
          <ul>{renderTasks()}</ul>
        ) : (
          <p>Porfavor registrese para poder ver sus listas</p>
        )}
      </div>
    </>
  );
};

export default withTracker(() => {
  Meteor.subscribe('tasks');
  return {
    currentUser: Meteor.user(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch()
  };
})(App);
