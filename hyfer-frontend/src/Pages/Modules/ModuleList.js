import React, { Component } from 'react';
import ModuleItem from './ModuleItem';
// import ModuleObservable from './ModuleObservable';
import style from '../../assets/styles/modules.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { inject, observer } from 'mobx-react';


@inject('modulesStore')
@observer
export default class ModuleList extends Component {

  componentDidMount () {
    window.addEventListener('resize', this.props.modulesStore.computeWeekWidth);
    this.props.modulesStore.computeWeekWidth();
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.props.modulesStore.computeWeekWidth);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.props.modulesStore.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              {this.props.modules.map((item, ind) => (
                <Draggable key={item.id} draggableId={item.id} index={ind}>
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
                          module={item}
                          key={item.id}
                          weekWidth={this.props.modulesStore.weekWidth}
                        />
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
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
