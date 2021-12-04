'use strict'

import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { create } from '@domql/element'
import { clone } from '@domql/utils'

export function DOMQLRenderer (component, ref, receivedProps, receivedState) {
  const { current } = ref
  const { DOMQLElement } = current
  const { children, ...p } = receivedProps

  const props = clone(p)
  const state = clone(receivedState)

  if (!DOMQLElement) {
    current.DOMQLElement = create({
      proto: component,
      node: current.DOMQLElement,
      state,
      props: el => props,
      content: (el) => {
        ReactDOM.render(children, el.node)
      }
    }, current).node
  } else {
    const { ref } = DOMQLElement
    ref.update({
      props,
      state
    }).set(el => {
      ReactDOM.render(children, el.node)
      return { tag: 'fragment' }
    })
  }
}

export const reactTransformer = (component, props, state) => {
  const ref = useRef(null)
  return (
    <span ref={ref}>
      {
        useEffect(() => {
          DOMQLRenderer(component, ref, props, state)
        })
      }
    </span>
  )
}
