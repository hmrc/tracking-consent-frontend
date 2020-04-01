import callIfNotNull from "./callIfNotNull";

const focusIfNotNull = (element: HTMLElement | null) => {
    callIfNotNull(element, element => element.focus())
}

export default focusIfNotNull