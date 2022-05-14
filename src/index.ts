import type { RenderableTreeNodes, Scalar } from "@markdoc/markdoc";
import type { Component, JSX } from "solid-js";
import { createComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

function Fragment(props: { children: JSX.Element }) {
  return props.children;
}

export default function dynamic(
  node: RenderableTreeNodes,
  { components }: { components?: Record<string, Component> } = {}
) {
  function deepRender(value: any): any {
    if (value == null || typeof value !== "object") return value;

    if (Array.isArray(value)) {
      return value.map((item) => deepRender(item));
    }

    if (value.$$mdType === "Tag") {
      return render(value);
    }

    if (typeof value !== "object") {
      return value;
    }

    const output: Record<string, Scalar> = {};
    for (const [k, v] of Object.entries(value)) output[k] = deepRender(v);
    return output;
  }

  function render(node: RenderableTreeNodes): any {
    if (Array.isArray(node)) {
      return createComponent(Fragment, { children: node.map(render) });
    }

    if (node === null || typeof node !== "object") {
      return node;
    }

    const { name, attributes = {}, children = [] } = node;

    const attr =
      Object.keys(attributes).length === 0 ? null : deepRender(attributes);

    if (components && components[name]) {
      return createComponent(components[name], {
        ...attr,
        children: children.map(render),
      });
    }

    return createComponent(
      Dynamic({
        component: name,
        children: children.map(render),
        ...attr,
      }),
      {}
    );
  }

  return render(node);
}
