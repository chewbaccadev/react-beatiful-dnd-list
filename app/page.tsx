'use client';
import DragIndicator from '@/public/DragIndicator.png';
import AccountCircle from '@/public/AccountCircle.png';
import Add from '@/public/Add.png';
import Delete from '@/public/Delete.png';
import Image from 'next/image';
import { CSSProperties, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import styles from './page.module.css';

const Home = () => {
  const getItems = (count: number) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: k + 1,
      content: `Item ${k + 1}`,
    }));

  const grid = 8;
  const [items, setItems] = useState<
    {
      id: number;
      content: string;
    }[]
  >(() => getItems(5));

  // a little function to help us with reordering the result
  const reorder = (
    list: {
      id: number;
      content: string;
    }[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'rgb(200, 200, 200, 0.1)' : 'transparent',
    padding: grid,
  });

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    width: '100%',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'grey',
    background: 'lightgrey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const onDragEnd: OnDragEndResponder = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setItems((prev) =>
      reorder(prev, result.source.index, result!.destination!.index)
    );
  };

  const onAddItem = () => {
    setItems((prev) => {
      console.log(prev);
      if (prev.length === 0) {
        return [{ id: 1, content: 'Item 1' }];
      }
      // Always add a bigger id than what is in the list
      const idArr = prev.map((item) => item.id);
      const largestId = Math.max(...idArr);

      return [
        ...prev,
        {
          id: largestId + 1,
          content: `Item ${largestId + 1}`,
        },
      ];
    });
  };

  const onDeleteItem = (id: number) => {
    const indexToBeRemoved = items.findIndex((item) => item.id === id);

    // Won't work if you splice on the items arr directly (ask Atlassian why that is)
    const newItems = [...items];

    newItems.splice(indexToBeRemoved, 1);

    setItems(newItems);
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>Drag to reorder:</h1>
        <button
          className={`${styles.button} ${styles.addButton}`}
          onClick={onAddItem}
          type='button'
        >
          <Image
            src={Add.src}
            width={Add.width}
            height={Add.height}
            alt='Add icon'
            title='Add item'
          />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`${item.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div className={styles.listItemContentWrapper}>
                        <Image
                          src={DragIndicator.src}
                          width={DragIndicator.width}
                          height={DragIndicator.height}
                          alt='Drag indicator icon'
                          style={{ width: 32, height: 32 }}
                        />
                        <Image
                          src={AccountCircle.src}
                          width={AccountCircle.width}
                          height={AccountCircle.height}
                          alt='Account circle icon'
                          style={{ width: 44, height: 44, marginRight: '2rem' }}
                        />
                        <p style={{ fontSize: '1.2rem' }}>{item.content}</p>
                      </div>

                      <button
                        className={`${styles.button} ${styles.deleteButton}`}
                        onClick={onDeleteItem.bind(null, item.id)}
                        type='button'
                      >
                        <Image
                          src={Delete.src}
                          width={Delete.width}
                          height={Delete.height}
                          alt='Delete button'
                          title='Delete item'
                        />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
};

export default Home;
