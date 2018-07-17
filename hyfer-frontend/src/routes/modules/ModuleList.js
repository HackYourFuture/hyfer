import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModuleItem from './ModuleItem';
import style from './modules.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { inject, observer } from 'mobx-react';

@inject('moduleStore')
@observer
export default class ModuleList extends Component {

  weekWidth = 1;

  componentDidMount() {
    this.props.moduleStore.getModules();
    window.addEventListener('resize', this.computeWeekWidth);
    this.computeWeekWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.computeWeekWidth);
  }

  computeWeekWidth = () => {
    const week_element = document.querySelector('.week_element');
    if (week_element != null) {
      this.weekWidth = week_element.clientWidth;
    }
  }

  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { modules, setModules } = this.props.moduleStore;
    const newModules = [...modules];
    const [removed] = newModules.splice(result.source.index, 1);
    newModules.splice(result.destination.index, 0, removed);
    setModules(newModules);
  }

  render() {
    const { modules } = this.props.moduleStore;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {provided => (
                    <div
                      style={{
                        width: '1px',
                        overflow: 'visible',
                        margin: '1vh 0',
                      }}
                    >
                      <div
                        className={style.moduleList}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ModuleItem
                          module={module}
                          weekWidth={this.weekWidth}
                        />
                      </div>
                      {provided.placeholder}
                    </div>
                  )
                  }
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

ModuleList.wrappedComponent.propTypes = {
  moduleStore: PropTypes.object.isRequired,
};
