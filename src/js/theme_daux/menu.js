import { ready } from "./utils";

function recalculateHeight() {
  return new Promise((resolve, reject) => {
    const collapsibleNode = document.querySelector(".Collapsible__content");

    const realMenuNode = collapsibleNode.querySelector("ul");
    const linkNode = collapsibleNode.querySelector(".Links");

    const height = realMenuNode.offsetHeight + linkNode.offsetHeight;
    collapsibleNode.style.height = `calc(${height}px + 2em)`;
  });
}
function resetMenuHeightTransitioned(item) {
  const recalculateHeightDelaed = ev => {
    recalculateHeight().then(() => {
      ev.target.removeEventListener("transitionend", recalculateHeightDelaed);
    });
  };

  item.addEventListener("transitionend", recalculateHeightDelaed);
}

/**
 * After the transition finishes set the height to auto so child
 * menus can expand properly.
 * @param {Element} item
 */
function resetHeightAfterAnimation(item) {
  const setHeightToAuto = ev => {
    if (ev.target.style.height !== "0px") {
      ev.target.style.height = "auto";
    }

    ev.target.removeEventListener("transitionend", setHeightToAuto);
  };

  item.addEventListener("transitionend", setHeightToAuto);
}

function findNavItem(start) {
  let elem = start;
  while ((elem = elem.parentNode) && elem.nodeType !== 9) {
    if (elem.nodeType === 1 && elem.classList.contains("Nav__item")) {
      return elem;
    }
  }

  throw new Error("Could not find a NavItem...");
}

function toggleSubMenu(ev) {
  const isEvent = ev.preventDefault !== undefined;

  if (isEvent) {
    ev.preventDefault();
  }

  const parent = findNavItem(ev.target);
  const subNav = parent.querySelector("ul.Nav");

  if (isEvent && parent.classList.contains("Nav__item--open")) {
    // Temporarily set the height so the transition can work.
    subNav.style.height = `${subNav.scrollHeight}px`;
    subNav.style.transitionDuration = "150ms";
    subNav.style.height = "0px";
    parent.classList.remove("Nav__item--open");
    recalculateHeight();
  } else {
    if (isEvent) {
      subNav.style.transitionDuration = "150ms";
      resetHeightAfterAnimation(subNav);
      resetMenuHeightTransitioned(subNav);
      subNav.style.height = `${subNav.scrollHeight}px`;
      parent.classList.add("Nav__item--open");
    } else {
      // When running at page load the transitions don't need to fire and
      // the classList doesn't need to be altered.
      subNav.style.height = "auto";
      recalculateHeight();
    }
  }
}

ready(() => {
  const navItems = document.querySelectorAll(
    ".Nav__item.has-children i.Nav__arrow"
  );

  // Go in reverse here because on page load the child nav items need to be
  // opened first before their parents so the height on the parents can be
  // calculated properly.
  for (let i = navItems.length - 1, target; i >= 0; i--) {
    target = navItems[i];
    target.addEventListener("click", toggleSubMenu);

    if (target.parentNode.parentNode.classList.contains("Nav__item--open")) {
      toggleSubMenu({ target });
    }
  }

  // Some navigations just have sub-pages without having a page by themselves
  const ajNav = document.querySelectorAll(".Nav__item__link--nopage");
  for (const navItem of ajNav) {
    navItem.addEventListener("click", toggleSubMenu);
  }
});
