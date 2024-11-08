interface TooltipCoords {
  top: number;
  left: number;
}
export function formatVariableKey(str: string): string {
  return str
    .replace(/-_$/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase();
}

export function getMinWidth(element: HTMLElement, maxWidth: number): number {
  const extraCharPadding = 2;
  const elementWidth = element.getBoundingClientRect().width + extraCharPadding;
  const elementStyle = window.getComputedStyle(element);

  const elementPaddingLeft = parseInt(elementStyle.getPropertyValue('padding-left'), 10);
  const elementPaddingRight = parseInt(elementStyle.getPropertyValue('padding-right'), 10);

  const elementPadding = elementPaddingLeft + elementPaddingRight;
  const contentWidth = elementWidth - elementPadding;

  return Math.round(Math.min(maxWidth, contentWidth || maxWidth));
}

export function isElementInViewport(element: HTMLElement, container: HTMLElement | null = null, position?: string): boolean {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  let isInsideViewport =
    rect.bottom > 0 &&
    rect.top < viewportHeight &&
    rect.right > 0 &&
    rect.left < viewportWidth;

  if (container) {
    const containerRect = container.getBoundingClientRect();

    if (position === 'top' || position === 'bottom') {
      isInsideViewport =
        containerRect.bottom + containerRect.height < viewportHeight &&
        containerRect.top < viewportHeight;
    } else {
      isInsideViewport =
        containerRect.right + containerRect.width < viewportWidth &&
        containerRect.left < viewportWidth;
    }

    return isInsideViewport;
  }

  return isInsideViewport;
};

export function computeTooltipPosition(containerRef: HTMLElement | null, tooltipRef: HTMLElement | null, position: string, coords: TooltipCoords): TooltipCoords {
  if (!containerRef || !tooltipRef) {
    return coords;
  }

  const tooltipRect = tooltipRef.getBoundingClientRect();
  const containerRect = containerRef.getBoundingClientRect();
  const containerPosition = window.getComputedStyle(containerRef).position;
  const containerStyle = window.getComputedStyle(containerRef);

  let cumulativeOffsetTop = 0;
  let cumulativeOffsetLeft = 0;

  let fixedOffsetTop = 0;
  let stickyOffsetTop = 0;
  let fixedOffsetLeft = 0;

  let currentElement = containerRef;

  while (currentElement && currentElement !== document.body) {
    const computedStyle = window.getComputedStyle(currentElement);
    const elementPosition = computedStyle.position;
    const currentRect = currentElement.getBoundingClientRect();

    if (elementPosition === 'fixed') {
      fixedOffsetTop +=
        currentRect.top + window.scrollY;
      fixedOffsetLeft +=
        currentRect.left + window.scrollX;
    } else if (elementPosition === 'sticky') {
      stickyOffsetTop += currentRect.top;
      fixedOffsetLeft +=
        currentRect.left + window.scrollX;
    } else if (elementPosition === 'absolute' || elementPosition === 'relative') {
      if (elementPosition === 'absolute') {
        cumulativeOffsetTop -= parseFloat(computedStyle.top) || 0;
        cumulativeOffsetLeft -= parseFloat(computedStyle.left) || 0;
      }

      if (elementPosition === 'relative') {
        cumulativeOffsetTop -= currentElement.offsetTop;
        cumulativeOffsetLeft -= currentElement.offsetLeft;

        if (position === 'bottom') {
          cumulativeOffsetTop += containerRect.height;
        }

        if (position === 'right') {
          cumulativeOffsetLeft -= containerRect.width;
        }

        if (containerPosition === 'absolute') {
          if (position === 'right') {
            cumulativeOffsetLeft += containerRect.width;
          }
        }
      }
    }

    const transform = computedStyle.transform;

    if (transform && transform !== 'none') {
      const transformMatrix = new DOMMatrix(transform);

      if (elementPosition === 'relative' || elementPosition === 'absolute') {
        cumulativeOffsetTop -= transformMatrix.m42;
        cumulativeOffsetLeft -= transformMatrix.m41;
      } else {
        cumulativeOffsetTop -= currentElement.offsetTop + transformMatrix.m42;
        cumulativeOffsetLeft -= currentElement.offsetLeft + transformMatrix.m41;
      }
    }

    currentElement = currentElement.parentElement!;
  }

  let finalTop =
    containerRect.top + cumulativeOffsetTop + stickyOffsetTop - fixedOffsetTop;
  let finalLeft = containerRect.left + cumulativeOffsetLeft - fixedOffsetLeft;

  switch (position) {
    case 'top':
      coords.top = finalTop;
      coords.left = finalLeft + containerRect.width / 2;
      break;
    case 'bottom':
      coords.top = finalTop - tooltipRect.height;
      coords.left = finalLeft + containerRect.width / 2;
      break;
    case 'left':
      coords.left = finalLeft;
      coords.top = finalTop + containerRect.height / 2;
      break;
    case 'right':
      coords.left = finalLeft + containerRect.width - tooltipRect.width;
      coords.top = finalTop + containerRect.height / 2;
      break;
  }

  coords.top += window.scrollY;
  coords.left += window.scrollX;

  return coords;
};