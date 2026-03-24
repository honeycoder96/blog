import { useState } from 'preact/hooks';
import type { ComponentChildren, VNode } from 'preact';

interface TabProps {
  label: string;
  children?: ComponentChildren;
}

export function Tab({ children }: TabProps) {
  return <div class="mdx-tab-pane">{children}</div>;
}

interface TabsProps {
  children: ComponentChildren;
}

export function Tabs({ children }: TabsProps) {
  const [active, setActive] = useState(0);
  const childArray = (Array.isArray(children) ? children : [children]).filter(
    Boolean,
  ) as VNode<TabProps>[];

  return (
    <div class="mdx-tabs">
      <div class="mdx-tabs-nav" role="tablist">
        {childArray.map((child, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            class={'mdx-tab-btn' + (i === active ? ' mdx-tab-btn--active' : '')}
            onClick={() => setActive(i)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div class="mdx-tab-panel" role="tabpanel">
        {childArray[active]}
      </div>
    </div>
  );
}
