import { nanoid } from 'nanoid';
import { ref, computed, watch, onBeforeMount } from '@vue/composition-api';
import { LOCAL_STORAGE_KEY_TODO_APP } from '../config/localStorage';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function setupTodoApp() {
  /**
   * Reactive data
   */
  const todoAllToggle = ref(false);
  const newTodo = ref('');
  const beforeEditTodo = ref('');
  const showTooltip = ref(false);
  const todoItems = ref<Array<{ id: string; name: string; completed: boolean; editable: boolean }>>([]);
  const sortButtons = ref([
    {
      id: `sortButton_${nanoid()}`,
      name: 'all',
      selected: true,
    },
    {
      id: `sortButton_${nanoid()}`,
      name: 'active',
      selected: false,
    },
    {
      id: `sortButton_${nanoid()}`,
      name: 'completed',
      selected: false,
    },
  ]);
  const sortCategory = ref('all');
  /**
   * Computed properties
   */
  const todoItemsToShow = computed(() => {
    const isActive = sortCategory.value === 'active';
    const isCompleted = sortCategory.value === 'completed';
    if (!(isActive || isCompleted)) return todoItems.value;
    return todoItems.value.filter((item) => (isActive ? !item.completed : item.completed));
  });
  const numberOfItemsLeft = computed(() => todoItems.value.filter((item) => !item.completed).length);
  /**
   * Watch
   */
  watch(todoAllToggle, (isChecked) => {
    todoItems.value = todoItems.value.map((item) => ({ ...item, completed: isChecked }));
  });
  watch(
    todoItems,
    (items) => {
      localStorage.setItem(LOCAL_STORAGE_KEY_TODO_APP, JSON.stringify([...items]));
    },
    { deep: true },
  );
  /**
   * On before mount (It also works with onMounted)
   */
  onBeforeMount(() => {
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY_TODO_APP);
    const itemsToSet = localStorageValue ? JSON.parse(localStorageValue) : [];
    todoItems.value = itemsToSet;
  });
  /**
   * Methods
   */
  function addNewItem(): void {
    if (newTodo.value === '') {
      showTooltip.value = true;
      setTimeout(() => {
        showTooltip.value = false;
      }, 1000);
      return;
    }
    todoItems.value.push({
      id: `todoItem_${nanoid()}`,
      name: newTodo.value,
      completed: false,
      editable: false,
    });
    newTodo.value = '';
  }
  function checkItem(itemId: string): void {
    const matchedTodoItem = todoItems.value.find((item) => item.id === itemId);
    if (!matchedTodoItem) return;
    matchedTodoItem.completed = !matchedTodoItem.completed;
  }
  function finishEditTodoItem(): void {
    todoItems.value = todoItems.value.map((item) => ({ ...item, editable: false }));
    const emptyTodoItem = todoItems.value.find((item) => item.name === '');
    if (emptyTodoItem) {
      todoItems.value = todoItems.value.filter((item) => item.id !== emptyTodoItem.id);
    }
  }
  function editTodoItem(itemId: string): void {
    finishEditTodoItem();
    const matchedEditTodoItem = todoItems.value.find((item) => item.id === itemId);
    if (!matchedEditTodoItem) return;
    matchedEditTodoItem.editable = !matchedEditTodoItem.editable;
    beforeEditTodo.value = matchedEditTodoItem.name;
  }
  function cancelEditTodoItem(itemId: string): void {
    const matchedEditTodoItem = todoItems.value.find((item) => item.id === itemId);
    if (!matchedEditTodoItem) return;
    matchedEditTodoItem.name = beforeEditTodo.value;
    finishEditTodoItem();
  }
  function deleteItem(itemId: string): void {
    todoItems.value = todoItems.value.filter((item) => item.id !== itemId);
  }
  function sortItems(itemId: string): void {
    sortButtons.value = sortButtons.value.map((sortButton) => ({ ...sortButton, selected: false }));
    const matchedSortButton = sortButtons.value.find((item) => item.id === itemId);
    if (matchedSortButton) {
      matchedSortButton.selected = !matchedSortButton.selected;
      sortCategory.value = matchedSortButton.name;
    }
  }
  function clearCompleted(): void {
    todoItems.value = todoItems.value.filter((item) => !item.completed);
  }
  /**
   * Return
   */
  return {
    // Reactive data
    todoAllToggle,
    newTodo,
    showTooltip,
    todoItems,
    sortButtons,
    sortCategory,
    // Computed properties
    todoItemsToShow,
    numberOfItemsLeft,
    // Methods
    addNewItem,
    checkItem,
    editTodoItem,
    cancelEditTodoItem,
    deleteItem,
    finishEditTodoItem,
    sortItems,
    clearCompleted,
  };
}
