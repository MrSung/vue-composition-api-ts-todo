<template>
  <li :class="$style.todo">
    <div :class="{ [$style.todoEditable]: editable }">
      <TodoItemCheckboxLabel
        :checked="checked"
        :dark-mode="darkMode"
        :label-text="labelText"
        @handle-change="handleLabelChange"
        @handle-db-click="handleLabelDbClick"
      />
      <TodoItemButtonDelete :dark-mode="darkMode" @handle-click="handleCloseButtonClick" />
    </div>
    <input
      v-todo-focus="itemEditable"
      type="text"
      :value="itemName"
      :class="[$style.todoInput, { [$style['todoInput--shown']]: itemEditable }]"
      @input="$emit('update:itemName', $event.target.value)"
      @blur="handleInputBlur"
      @keyup.enter="handleInputKeyupEnter"
      @keyup.esc="handleInputKeyupEsc"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import TodoItemCheckboxLabel from '../atoms/TodoItemCheckboxLabel.vue';
import TodoItemButtonDelete from '../atoms/TodoItemButtonDelete.vue';

export default defineComponent({
  components: {
    TodoItemCheckboxLabel,
    TodoItemButtonDelete,
  },
  directives: {
    // ダブルクリックした際にfocusされて即時でinput可能にする
    'todo-focus': (el, binding): void => {
      if (binding.value) el.focus();
    },
  },
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
    darkMode: {
      type: Boolean,
      required: true,
    },
    labelText: {
      type: String,
      required: true,
    },
    itemEditable: {
      type: Boolean,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    function handleLabelChange(): void {
      emit('handle-label-change');
    }
    function handleLabelDbClick(): void {
      emit('handle-label-db-click');
    }
    function handleCloseButtonClick(): void {
      emit('handle-close-button-click');
    }
    function handleInputBlur(): void {
      emit('handle-input-blur');
    }
    function handleInputKeyupEnter(): void {
      emit('handle-input-keyup-enter');
    }
    function handleInputKeyupEsc(): void {
      emit('handle-input-keyup-esc');
    }
    return {
      handleLabelChange,
      handleLabelDbClick,
      handleCloseButtonClick,
      handleInputBlur,
      handleInputKeyupEnter,
      handleInputKeyupEsc,
    };
  },
});
</script>

<style lang="scss" module>
.todo {
  background-color: var(--color-todo-background);
  box-shadow: 0 1px 1px var(--color-todo-boxShadow-lighter);
  font-size: 24px;
  min-height: 91px;
  padding: 16px;
  position: relative;

  &:not(:first-of-type) {
    border-top: 1px solid var(--color-todo-boxShadow-light);
  }
}

.todoEditable {
  appearance: none;
  visibility: hidden;
}

.todoInput {
  box-shadow: inset 0 -1px 5px 0 var(--color-todo-boxShadow-lighter);
  display: none;
  left: 0;
  margin-left: 76px;
  padding: 27px 31px 28px 0;
  position: absolute;
  top: 0;
  width: calc(100% - 76px);

  &--shown {
    display: block;
  }
}
</style>
