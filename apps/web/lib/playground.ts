import { superstate } from '@superstate/core'

export const Playground = {
  state: superstate<IState>({
    containerPercentage: 100,
    itemsAmount: 1000,
    gap: 0,
    gutter: 0,
    placeholder: false,
  }),

  get gap() {
    return this.state.now().gap
  },

  set gap(newGap: number) {
    this.state.set((prev) => ({ ...prev, gap: newGap }))
  },

  get gutter() {
    return this.state.now().gutter
  },

  set gutter(newGutter: number) {
    this.state.set((prev) => ({ ...prev, gutter: newGutter }))
  },

  get containerPercentage() {
    return this.state.now().containerPercentage
  },

  set containerPercentage(newContainerPercentage: number) {
    this.state.set((prev) => ({
      ...prev,
      containerPercentage: newContainerPercentage,
    }))
  },

  get itemsAmount() {
    return this.state.now().itemsAmount
  },

  set itemsAmount(newItemsAmount: number) {
    this.state.set((prev) => ({ ...prev, itemsAmount: newItemsAmount }))
  },

  get placeholder() {
    return this.state.now().placeholder
  },

  set placeholder(newPlaceholder: boolean) {
    this.state.set((prev) => ({ ...prev, placeholder: newPlaceholder }))
  },
}

interface IState {
  containerPercentage: number
  itemsAmount: number
  gap: number
  gutter: number
  placeholder: boolean
}
