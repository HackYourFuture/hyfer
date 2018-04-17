import React, { Component } from 'react'
import ModuleItem from './ModuleItem'
import ModuleObservable from './ModuleObservable'
import style from  '../../assets/styles/modules.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'


export default class ModuleList extends Component {


    state = {
        weekWidth: 1
    }

    componentDidMount = () => {
        window.addEventListener("resize", this.computeWeekWidth)
        this.computeWeekWidth()
    }


    componentWillUnmount = () => {
        window.removeEventListener("resize", this.computeWeekWidth)
    }

    computeWeekWidth = () => {
        const week_element = document.querySelector('.week_element')
        if (week_element != null) {
            this.setState({ weekWidth : week_element.clientWidth })
        }
    }


    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return
        }
        const items = this.reorder(
            ModuleObservable.getModules(),
            result.source.index,
            result.destination.index
        )
        ModuleObservable.setModules(items)
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        {ModuleObservable.getModules().map((item,ind) => (
                        <Draggable key={item.id} draggableId={item.id} index={ind}>
                            {(provided, snapshot) => (
                            <div style={{width:"1px",overflow:"visible",margin: "1vh 0"}}>
                                <div className={style.moduleList}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <ModuleItem module={item}
                                        key={item.id}
                                        weekWidth={this.state.weekWidth}
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
        )
    }
}
