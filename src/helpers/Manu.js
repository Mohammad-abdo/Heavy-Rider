import { MENU_ITEMS } from '@/assets/data/menu-items';
import i18n from '@/i18n';
const translateMenuItems = (items = [], translate = i18n.t.bind(i18n)) =>
  items.map((item) => {
    const next = { ...item };
    if (item.label) {
      const translationKey = item.translationKey || item.label;
      next.label = translate(translationKey, { defaultValue: item.label });
    }
    if (item.badge?.text) {
      const badgeTranslationKey = item.badge.translationKey || item.badge.text;
      next.badge = {
        ...item.badge,
        text: translate(badgeTranslationKey, { defaultValue: item.badge.text }),
      };
    }
    if (item.children) {
      next.children = translateMenuItems(item.children, translate);
    }
    return next;
  });
export const getMenuItems = (translate) => {
  const translator = typeof translate === 'function' ? translate : i18n.t.bind(i18n);
  return translateMenuItems(MENU_ITEMS, translator);
};
export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};
export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};
export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};