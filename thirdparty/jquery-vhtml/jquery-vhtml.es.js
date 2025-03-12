var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  var f = n.default;
  if (typeof f == "function") {
    var a = function() {
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var nativeIsArray = Array.isArray;
var toString = Object.prototype.toString;
var xIsArray = nativeIsArray || isArray$3;
function isArray$3(obj) {
  return toString.call(obj) === "[object Array]";
}
var version$5 = "2";
var version$4 = version$5;
VirtualPatch.NONE = 0;
VirtualPatch.VTEXT = 1;
VirtualPatch.VNODE = 2;
VirtualPatch.WIDGET = 3;
VirtualPatch.PROPS = 4;
VirtualPatch.ORDER = 5;
VirtualPatch.INSERT = 6;
VirtualPatch.REMOVE = 7;
VirtualPatch.THUNK = 8;
var vpatch = VirtualPatch;
function VirtualPatch(type2, vNode, patch2) {
  this.type = Number(type2);
  this.vNode = vNode;
  this.patch = patch2;
}
VirtualPatch.prototype.version = version$4;
VirtualPatch.prototype.type = "VirtualPatch";
var version$3 = version$5;
var isVnode = isVirtualNode;
function isVirtualNode(x) {
  return x && x.type === "VirtualNode" && x.version === version$3;
}
var version$2 = version$5;
var isVtext = isVirtualText;
function isVirtualText(x) {
  return x && x.type === "VirtualText" && x.version === version$2;
}
var isWidget_1 = isWidget$7;
function isWidget$7(w) {
  return w && w.type === "Widget";
}
var isThunk_1 = isThunk$3;
function isThunk$3(t) {
  return t && t.type === "Thunk";
}
var isVNode$4 = isVnode;
var isVText$3 = isVtext;
var isWidget$6 = isWidget_1;
var isThunk$2 = isThunk_1;
var handleThunk_1 = handleThunk$2;
function handleThunk$2(a, b) {
  var renderedA = a;
  var renderedB = b;
  if (isThunk$2(b)) {
    renderedB = renderThunk(b, a);
  }
  if (isThunk$2(a)) {
    renderedA = renderThunk(a, null);
  }
  return {
    a: renderedA,
    b: renderedB
  };
}
function renderThunk(thunk, previous) {
  var renderedThunk = thunk.vnode;
  if (!renderedThunk) {
    renderedThunk = thunk.vnode = thunk.render(previous);
  }
  if (!(isVNode$4(renderedThunk) || isVText$3(renderedThunk) || isWidget$6(renderedThunk))) {
    throw new Error("thunk did not return a valid node");
  }
  return renderedThunk;
}
var isObject$2 = function isObject(x) {
  return typeof x === "object" && x !== null;
};
var isVhook = isHook$3;
function isHook$3(hook) {
  return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
}
var isObject$1 = isObject$2;
var isHook$2 = isVhook;
var diffProps_1 = diffProps$1;
function diffProps$1(a, b) {
  var diff2;
  for (var aKey in a) {
    if (!(aKey in b)) {
      diff2 = diff2 || {};
      diff2[aKey] = void 0;
    }
    var aValue = a[aKey];
    var bValue = b[aKey];
    if (aValue === bValue) {
      continue;
    } else if (isObject$1(aValue) && isObject$1(bValue)) {
      if (getPrototype$1(bValue) !== getPrototype$1(aValue)) {
        diff2 = diff2 || {};
        diff2[aKey] = bValue;
      } else if (isHook$2(bValue)) {
        diff2 = diff2 || {};
        diff2[aKey] = bValue;
      } else {
        var objectDiff = diffProps$1(aValue, bValue);
        if (objectDiff) {
          diff2 = diff2 || {};
          diff2[aKey] = objectDiff;
        }
      }
    } else {
      diff2 = diff2 || {};
      diff2[aKey] = bValue;
    }
  }
  for (var bKey in b) {
    if (!(bKey in a)) {
      diff2 = diff2 || {};
      diff2[bKey] = b[bKey];
    }
  }
  return diff2;
}
function getPrototype$1(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value);
  } else if (value.__proto__) {
    return value.__proto__;
  } else if (value.constructor) {
    return value.constructor.prototype;
  }
}
var isArray$2 = xIsArray;
var VPatch$1 = vpatch;
var isVNode$3 = isVnode;
var isVText$2 = isVtext;
var isWidget$5 = isWidget_1;
var isThunk$1 = isThunk_1;
var handleThunk$1 = handleThunk_1;
var diffProps = diffProps_1;
var diff_1$1 = diff$2;
function diff$2(a, b) {
  var patch2 = { a };
  walk(a, b, patch2, 0);
  return patch2;
}
function walk(a, b, patch2, index) {
  if (a === b) {
    return;
  }
  var apply = patch2[index];
  var applyClear = false;
  if (isThunk$1(a) || isThunk$1(b)) {
    thunks(a, b, patch2, index);
  } else if (b == null) {
    if (!isWidget$5(a)) {
      clearState(a, patch2, index);
      apply = patch2[index];
    }
    apply = appendPatch(apply, new VPatch$1(VPatch$1.REMOVE, a, b));
  } else if (isVNode$3(b)) {
    if (isVNode$3(a)) {
      if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
        var propsPatch = diffProps(a.properties, b.properties);
        if (propsPatch) {
          apply = appendPatch(
            apply,
            new VPatch$1(VPatch$1.PROPS, a, propsPatch)
          );
        }
        apply = diffChildren(a, b, patch2, apply, index);
      } else {
        apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b));
        applyClear = true;
      }
    } else {
      apply = appendPatch(apply, new VPatch$1(VPatch$1.VNODE, a, b));
      applyClear = true;
    }
  } else if (isVText$2(b)) {
    if (!isVText$2(a)) {
      apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b));
      applyClear = true;
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VPatch$1(VPatch$1.VTEXT, a, b));
    }
  } else if (isWidget$5(b)) {
    if (!isWidget$5(a)) {
      applyClear = true;
    }
    apply = appendPatch(apply, new VPatch$1(VPatch$1.WIDGET, a, b));
  }
  if (apply) {
    patch2[index] = apply;
  }
  if (applyClear) {
    clearState(a, patch2, index);
  }
}
function diffChildren(a, b, patch2, apply, index) {
  var aChildren = a.children;
  var orderedSet = reorder(aChildren, b.children);
  var bChildren = orderedSet.children;
  var aLen = aChildren.length;
  var bLen = bChildren.length;
  var len = aLen > bLen ? aLen : bLen;
  for (var i2 = 0; i2 < len; i2++) {
    var leftNode = aChildren[i2];
    var rightNode = bChildren[i2];
    index += 1;
    if (!leftNode) {
      if (rightNode) {
        apply = appendPatch(
          apply,
          new VPatch$1(VPatch$1.INSERT, null, rightNode)
        );
      }
    } else {
      walk(leftNode, rightNode, patch2, index);
    }
    if (isVNode$3(leftNode) && leftNode.count) {
      index += leftNode.count;
    }
  }
  if (orderedSet.moves) {
    apply = appendPatch(apply, new VPatch$1(
      VPatch$1.ORDER,
      a,
      orderedSet.moves
    ));
  }
  return apply;
}
function clearState(vNode, patch2, index) {
  unhook(vNode, patch2, index);
  destroyWidgets(vNode, patch2, index);
}
function destroyWidgets(vNode, patch2, index) {
  if (isWidget$5(vNode)) {
    if (typeof vNode.destroy === "function") {
      patch2[index] = appendPatch(
        patch2[index],
        new VPatch$1(VPatch$1.REMOVE, vNode, null)
      );
    }
  } else if (isVNode$3(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
    var children = vNode.children;
    var len = children.length;
    for (var i2 = 0; i2 < len; i2++) {
      var child = children[i2];
      index += 1;
      destroyWidgets(child, patch2, index);
      if (isVNode$3(child) && child.count) {
        index += child.count;
      }
    }
  } else if (isThunk$1(vNode)) {
    thunks(vNode, null, patch2, index);
  }
}
function thunks(a, b, patch2, index) {
  var nodes = handleThunk$1(a, b);
  var thunkPatch = diff$2(nodes.a, nodes.b);
  if (hasPatches(thunkPatch)) {
    patch2[index] = new VPatch$1(VPatch$1.THUNK, null, thunkPatch);
  }
}
function hasPatches(patch2) {
  for (var index in patch2) {
    if (index !== "a") {
      return true;
    }
  }
  return false;
}
function unhook(vNode, patch2, index) {
  if (isVNode$3(vNode)) {
    if (vNode.hooks) {
      patch2[index] = appendPatch(
        patch2[index],
        new VPatch$1(
          VPatch$1.PROPS,
          vNode,
          undefinedKeys(vNode.hooks)
        )
      );
    }
    if (vNode.descendantHooks || vNode.hasThunks) {
      var children = vNode.children;
      var len = children.length;
      for (var i2 = 0; i2 < len; i2++) {
        var child = children[i2];
        index += 1;
        unhook(child, patch2, index);
        if (isVNode$3(child) && child.count) {
          index += child.count;
        }
      }
    }
  } else if (isThunk$1(vNode)) {
    thunks(vNode, null, patch2, index);
  }
}
function undefinedKeys(obj) {
  var result = {};
  for (var key in obj) {
    result[key] = void 0;
  }
  return result;
}
function reorder(aChildren, bChildren) {
  var bChildIndex = keyIndex(bChildren);
  var bKeys = bChildIndex.keys;
  var bFree = bChildIndex.free;
  if (bFree.length === bChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var aChildIndex = keyIndex(aChildren);
  var aKeys = aChildIndex.keys;
  var aFree = aChildIndex.free;
  if (aFree.length === aChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var newChildren = [];
  var freeIndex = 0;
  var freeCount = bFree.length;
  var deletedItems = 0;
  for (var i2 = 0; i2 < aChildren.length; i2++) {
    var aItem = aChildren[i2];
    var itemIndex;
    if (aItem.key) {
      if (bKeys.hasOwnProperty(aItem.key)) {
        itemIndex = bKeys[aItem.key];
        newChildren.push(bChildren[itemIndex]);
      } else {
        itemIndex = i2 - deletedItems++;
        newChildren.push(null);
      }
    } else {
      if (freeIndex < freeCount) {
        itemIndex = bFree[freeIndex++];
        newChildren.push(bChildren[itemIndex]);
      } else {
        itemIndex = i2 - deletedItems++;
        newChildren.push(null);
      }
    }
  }
  var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];
  for (var j2 = 0; j2 < bChildren.length; j2++) {
    var newItem = bChildren[j2];
    if (newItem.key) {
      if (!aKeys.hasOwnProperty(newItem.key)) {
        newChildren.push(newItem);
      }
    } else if (j2 >= lastFreeIndex) {
      newChildren.push(newItem);
    }
  }
  var simulate = newChildren.slice();
  var simulateIndex = 0;
  var removes = [];
  var inserts = [];
  var simulateItem;
  for (var k = 0; k < bChildren.length; ) {
    var wantedItem = bChildren[k];
    simulateItem = simulate[simulateIndex];
    while (simulateItem === null && simulate.length) {
      removes.push(remove(simulate, simulateIndex, null));
      simulateItem = simulate[simulateIndex];
    }
    if (!simulateItem || simulateItem.key !== wantedItem.key) {
      if (wantedItem.key) {
        if (simulateItem && simulateItem.key) {
          if (bKeys[simulateItem.key] !== k + 1) {
            removes.push(remove(simulate, simulateIndex, simulateItem.key));
            simulateItem = simulate[simulateIndex];
            if (!simulateItem || simulateItem.key !== wantedItem.key) {
              inserts.push({ key: wantedItem.key, to: k });
            } else {
              simulateIndex++;
            }
          } else {
            inserts.push({ key: wantedItem.key, to: k });
          }
        } else {
          inserts.push({ key: wantedItem.key, to: k });
        }
        k++;
      } else if (simulateItem && simulateItem.key) {
        removes.push(remove(simulate, simulateIndex, simulateItem.key));
      }
    } else {
      simulateIndex++;
      k++;
    }
  }
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex];
    removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
  }
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: newChildren,
      moves: null
    };
  }
  return {
    children: newChildren,
    moves: {
      removes,
      inserts
    }
  };
}
function remove(arr, index, key) {
  arr.splice(index, 1);
  return {
    from: index,
    key
  };
}
function keyIndex(children) {
  var keys = {};
  var free = [];
  var length = children.length;
  for (var i2 = 0; i2 < length; i2++) {
    var child = children[i2];
    if (child.key) {
      keys[child.key] = i2;
    } else {
      free.push(i2);
    }
  }
  return {
    keys,
    free
  };
}
function appendPatch(apply, patch2) {
  if (apply) {
    if (isArray$2(apply)) {
      apply.push(patch2);
    } else {
      apply = [apply, patch2];
    }
    return apply;
  } else {
    return patch2;
  }
}
var diff$1 = diff_1$1;
var diff_1 = diff$1;
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$1$3 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var topLevel = typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof window !== "undefined" ? window : {};
var minDoc = require$$1$3;
var doccy;
if (typeof document !== "undefined") {
  doccy = document;
} else {
  doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"];
  if (!doccy) {
    doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"] = minDoc;
  }
}
var document_1 = doccy;
var isObject2 = isObject$2;
var isHook$1 = isVhook;
var applyProperties_1 = applyProperties$2;
function applyProperties$2(node2, props, previous) {
  for (var propName in props) {
    var propValue = props[propName];
    if (propValue === void 0) {
      removeProperty(node2, propName, propValue, previous);
    } else if (isHook$1(propValue)) {
      removeProperty(node2, propName, propValue, previous);
      if (propValue.hook) {
        propValue.hook(
          node2,
          propName,
          previous ? previous[propName] : void 0
        );
      }
    } else {
      if (isObject2(propValue)) {
        patchObject(node2, props, previous, propName, propValue);
      } else {
        node2[propName] = propValue;
      }
    }
  }
}
function removeProperty(node2, propName, propValue, previous) {
  if (previous) {
    var previousValue = previous[propName];
    if (!isHook$1(previousValue)) {
      if (propName === "attributes") {
        for (var attrName in previousValue) {
          node2.removeAttribute(attrName);
        }
      } else if (propName === "style") {
        for (var i2 in previousValue) {
          node2.style[i2] = "";
        }
      } else if (typeof previousValue === "string") {
        node2[propName] = "";
      } else {
        node2[propName] = null;
      }
    } else if (previousValue.unhook) {
      previousValue.unhook(node2, propName, propValue);
    }
  }
}
function patchObject(node2, props, previous, propName, propValue) {
  var previousValue = previous ? previous[propName] : void 0;
  if (propName === "attributes") {
    for (var attrName in propValue) {
      var attrValue = propValue[attrName];
      if (attrValue === void 0) {
        node2.removeAttribute(attrName);
      } else {
        node2.setAttribute(attrName, attrValue);
      }
    }
    return;
  }
  if (previousValue && isObject2(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
    node2[propName] = propValue;
    return;
  }
  if (!isObject2(node2[propName])) {
    node2[propName] = {};
  }
  var replacer = propName === "style" ? "" : void 0;
  for (var k in propValue) {
    var value = propValue[k];
    node2[propName][k] = value === void 0 ? replacer : value;
  }
}
function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value);
  } else if (value.__proto__) {
    return value.__proto__;
  } else if (value.constructor) {
    return value.constructor.prototype;
  }
}
var document$2 = document_1;
var applyProperties$1 = applyProperties_1;
var isVNode$2 = isVnode;
var isVText$1 = isVtext;
var isWidget$4 = isWidget_1;
var handleThunk = handleThunk_1;
var createElement_1$1 = createElement$1;
function createElement$1(vnode2, opts) {
  var doc = opts ? opts.document || document$2 : document$2;
  var warn = opts ? opts.warn : null;
  vnode2 = handleThunk(vnode2).a;
  if (isWidget$4(vnode2)) {
    return vnode2.init();
  } else if (isVText$1(vnode2)) {
    return doc.createTextNode(vnode2.text);
  } else if (!isVNode$2(vnode2)) {
    if (warn) {
      warn("Item is not a valid virtual dom node", vnode2);
    }
    return null;
  }
  var node2 = vnode2.namespace === null ? doc.createElement(vnode2.tagName) : doc.createElementNS(vnode2.namespace, vnode2.tagName);
  var props = vnode2.properties;
  applyProperties$1(node2, props);
  var children = vnode2.children;
  for (var i2 = 0; i2 < children.length; i2++) {
    var childNode = createElement$1(children[i2], opts);
    if (childNode) {
      node2.appendChild(childNode);
    }
  }
  return node2;
}
var noChild = {};
var domIndex_1 = domIndex$1;
function domIndex$1(rootNode, tree, indices, nodes) {
  if (!indices || indices.length === 0) {
    return {};
  } else {
    indices.sort(ascending);
    return recurse(rootNode, tree, indices, nodes, 0);
  }
}
function recurse(rootNode, tree, indices, nodes, rootIndex) {
  nodes = nodes || {};
  if (rootNode) {
    if (indexInRange(indices, rootIndex, rootIndex)) {
      nodes[rootIndex] = rootNode;
    }
    var vChildren = tree.children;
    if (vChildren) {
      var childNodes = rootNode.childNodes;
      for (var i2 = 0; i2 < tree.children.length; i2++) {
        rootIndex += 1;
        var vChild = vChildren[i2] || noChild;
        var nextIndex = rootIndex + (vChild.count || 0);
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i2], vChild, indices, nodes, rootIndex);
        }
        rootIndex = nextIndex;
      }
    }
  }
  return nodes;
}
function indexInRange(indices, left, right) {
  if (indices.length === 0) {
    return false;
  }
  var minIndex = 0;
  var maxIndex = indices.length - 1;
  var currentIndex;
  var currentItem;
  while (minIndex <= maxIndex) {
    currentIndex = (maxIndex + minIndex) / 2 >> 0;
    currentItem = indices[currentIndex];
    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right;
    } else if (currentItem < left) {
      minIndex = currentIndex + 1;
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1;
    } else {
      return true;
    }
  }
  return false;
}
function ascending(a, b) {
  return a > b ? 1 : -1;
}
var isWidget$3 = isWidget_1;
var updateWidget_1 = updateWidget$1;
function updateWidget$1(a, b) {
  if (isWidget$3(a) && isWidget$3(b)) {
    if ("name" in a && "name" in b) {
      return a.id === b.id;
    } else {
      return a.init === b.init;
    }
  }
  return false;
}
var applyProperties = applyProperties_1;
var isWidget$2 = isWidget_1;
var VPatch = vpatch;
var updateWidget = updateWidget_1;
var patchOp$1 = applyPatch$1;
function applyPatch$1(vpatch2, domNode, renderOptions) {
  var type2 = vpatch2.type;
  var vNode = vpatch2.vNode;
  var patch2 = vpatch2.patch;
  switch (type2) {
    case VPatch.REMOVE:
      return removeNode(domNode, vNode);
    case VPatch.INSERT:
      return insertNode(domNode, patch2, renderOptions);
    case VPatch.VTEXT:
      return stringPatch(domNode, vNode, patch2, renderOptions);
    case VPatch.WIDGET:
      return widgetPatch(domNode, vNode, patch2, renderOptions);
    case VPatch.VNODE:
      return vNodePatch(domNode, vNode, patch2, renderOptions);
    case VPatch.ORDER:
      reorderChildren(domNode, patch2);
      return domNode;
    case VPatch.PROPS:
      applyProperties(domNode, patch2, vNode.properties);
      return domNode;
    case VPatch.THUNK:
      return replaceRoot(
        domNode,
        renderOptions.patch(domNode, patch2, renderOptions)
      );
    default:
      return domNode;
  }
}
function removeNode(domNode, vNode) {
  var parentNode = domNode.parentNode;
  if (parentNode) {
    parentNode.removeChild(domNode);
  }
  destroyWidget(domNode, vNode);
  return null;
}
function insertNode(parentNode, vNode, renderOptions) {
  var newNode = renderOptions.render(vNode, renderOptions);
  if (parentNode) {
    parentNode.appendChild(newNode);
  }
  return parentNode;
}
function stringPatch(domNode, leftVNode, vText, renderOptions) {
  var newNode;
  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.text);
    newNode = domNode;
  } else {
    var parentNode = domNode.parentNode;
    newNode = renderOptions.render(vText, renderOptions);
    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode);
    }
  }
  return newNode;
}
function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget);
  var newNode;
  if (updating) {
    newNode = widget.update(leftVNode, domNode) || domNode;
  } else {
    newNode = renderOptions.render(widget, renderOptions);
  }
  var parentNode = domNode.parentNode;
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  if (!updating) {
    destroyWidget(domNode, leftVNode);
  }
  return newNode;
}
function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
  var parentNode = domNode.parentNode;
  var newNode = renderOptions.render(vNode, renderOptions);
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}
function destroyWidget(domNode, w) {
  if (typeof w.destroy === "function" && isWidget$2(w)) {
    w.destroy(domNode);
  }
}
function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes;
  var keyMap = {};
  var node2;
  var remove2;
  var insert;
  for (var i2 = 0; i2 < moves.removes.length; i2++) {
    remove2 = moves.removes[i2];
    node2 = childNodes[remove2.from];
    if (remove2.key) {
      keyMap[remove2.key] = node2;
    }
    domNode.removeChild(node2);
  }
  var length = childNodes.length;
  for (var j2 = 0; j2 < moves.inserts.length; j2++) {
    insert = moves.inserts[j2];
    node2 = keyMap[insert.key];
    domNode.insertBefore(node2, insert.to >= length++ ? null : childNodes[insert.to]);
  }
}
function replaceRoot(oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot);
  }
  return newRoot;
}
var document$1 = document_1;
var isArray$1 = xIsArray;
var render = createElement_1$1;
var domIndex = domIndex_1;
var patchOp = patchOp$1;
var patch_1$1 = patch$2;
function patch$2(rootNode, patches, renderOptions) {
  renderOptions = renderOptions || {};
  renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch$2 ? renderOptions.patch : patchRecursive;
  renderOptions.render = renderOptions.render || render;
  return renderOptions.patch(rootNode, patches, renderOptions);
}
function patchRecursive(rootNode, patches, renderOptions) {
  var indices = patchIndices(patches);
  if (indices.length === 0) {
    return rootNode;
  }
  var index = domIndex(rootNode, patches.a, indices);
  var ownerDocument = rootNode.ownerDocument;
  if (!renderOptions.document && ownerDocument !== document$1) {
    renderOptions.document = ownerDocument;
  }
  for (var i2 = 0; i2 < indices.length; i2++) {
    var nodeIndex = indices[i2];
    rootNode = applyPatch(
      rootNode,
      index[nodeIndex],
      patches[nodeIndex],
      renderOptions
    );
  }
  return rootNode;
}
function applyPatch(rootNode, domNode, patchList, renderOptions) {
  if (!domNode) {
    return rootNode;
  }
  var newNode;
  if (isArray$1(patchList)) {
    for (var i2 = 0; i2 < patchList.length; i2++) {
      newNode = patchOp(patchList[i2], domNode, renderOptions);
      if (domNode === rootNode) {
        rootNode = newNode;
      }
    }
  } else {
    newNode = patchOp(patchList, domNode, renderOptions);
    if (domNode === rootNode) {
      rootNode = newNode;
    }
  }
  return rootNode;
}
function patchIndices(patches) {
  var indices = [];
  for (var key in patches) {
    if (key !== "a") {
      indices.push(Number(key));
    }
  }
  return indices;
}
var patch$1 = patch_1$1;
var patch_1 = patch$1;
var version$1 = version$5;
var isVNode$1 = isVnode;
var isWidget$1 = isWidget_1;
var isThunk = isThunk_1;
var isVHook = isVhook;
var vnode = VirtualNode;
var noProperties = {};
var noChildren = [];
function VirtualNode(tagName, properties, children, key, namespace) {
  this.tagName = tagName;
  this.properties = properties || noProperties;
  this.children = children || noChildren;
  this.key = key != null ? String(key) : void 0;
  this.namespace = typeof namespace === "string" ? namespace : null;
  var count = children && children.length || 0;
  var descendants = 0;
  var hasWidgets = false;
  var hasThunks = false;
  var descendantHooks = false;
  var hooks;
  for (var propName in properties) {
    if (properties.hasOwnProperty(propName)) {
      var property = properties[propName];
      if (isVHook(property) && property.unhook) {
        if (!hooks) {
          hooks = {};
        }
        hooks[propName] = property;
      }
    }
  }
  for (var i2 = 0; i2 < count; i2++) {
    var child = children[i2];
    if (isVNode$1(child)) {
      descendants += child.count || 0;
      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true;
      }
      if (!hasThunks && child.hasThunks) {
        hasThunks = true;
      }
      if (!descendantHooks && (child.hooks || child.descendantHooks)) {
        descendantHooks = true;
      }
    } else if (!hasWidgets && isWidget$1(child)) {
      if (typeof child.destroy === "function") {
        hasWidgets = true;
      }
    } else if (!hasThunks && isThunk(child)) {
      hasThunks = true;
    }
  }
  this.count = count + descendants;
  this.hasWidgets = hasWidgets;
  this.hasThunks = hasThunks;
  this.hooks = hooks;
  this.descendantHooks = descendantHooks;
}
VirtualNode.prototype.version = version$1;
VirtualNode.prototype.type = "VirtualNode";
var version = version$5;
var vtext = VirtualText;
function VirtualText(text) {
  this.text = String(text);
}
VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */
var browserSplit = function split(undef) {
  var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/.exec("")[1] === undef, self2;
  self2 = function(str, separator, limit) {
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + (separator.sticky ? "y" : ""), lastLastIndex = 0, separator = new RegExp(separator.source, flags + "g"), separator2, match, lastIndex, lastLength;
    str += "";
    if (!compliantExecNpcg) {
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    limit = limit === undef ? -1 >>> 0 : limit >>> 0;
    while (match = separator.exec(str)) {
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i2 = 1; i2 < arguments.length - 2; i2++) {
              if (arguments[i2] === undef) {
                match[i2] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++;
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };
  return self2;
}();
var split2 = browserSplit;
var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;
var parseTag_1 = parseTag$1;
function parseTag$1(tag, props) {
  if (!tag) {
    return "DIV";
  }
  var noId = !props.hasOwnProperty("id");
  var tagParts = split2(tag, classIdSplit);
  var tagName = null;
  if (notClassId.test(tagParts[1])) {
    tagName = "DIV";
  }
  var classes, part2, type2, i2;
  for (i2 = 0; i2 < tagParts.length; i2++) {
    part2 = tagParts[i2];
    if (!part2) {
      continue;
    }
    type2 = part2.charAt(0);
    if (!tagName) {
      tagName = part2;
    } else if (type2 === ".") {
      classes = classes || [];
      classes.push(part2.substring(1, part2.length));
    } else if (type2 === "#" && noId) {
      props.id = part2.substring(1, part2.length);
    }
  }
  if (classes) {
    if (props.className) {
      classes.push(props.className);
    }
    props.className = classes.join(" ");
  }
  return props.namespace ? tagName : tagName.toUpperCase();
}
var softSetHook$1 = SoftSetHook;
function SoftSetHook(value) {
  if (!(this instanceof SoftSetHook)) {
    return new SoftSetHook(value);
  }
  this.value = value;
}
SoftSetHook.prototype.hook = function(node2, propertyName) {
  if (node2[propertyName] !== this.value) {
    node2[propertyName] = this.value;
  }
};
var root = typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {};
var individual = Individual$1;
function Individual$1(key, value) {
  if (key in root) {
    return root[key];
  }
  root[key] = value;
  return value;
}
var Individual = individual;
var oneVersion = OneVersion;
function OneVersion(moduleName, version2, defaultValue) {
  var key = "__INDIVIDUAL_ONE_VERSION_" + moduleName;
  var enforceKey = key + "_ENFORCE_SINGLETON";
  var versionValue = Individual(enforceKey, version2);
  if (versionValue !== version2) {
    throw new Error("Can only have one copy of " + moduleName + ".\nYou already have version " + versionValue + " installed.\nThis means you cannot install version " + version2);
  }
  return Individual(key, defaultValue);
}
var OneVersionConstraint = oneVersion;
var MY_VERSION = "7";
OneVersionConstraint("ev-store", MY_VERSION);
var hashKey = "__EV_STORE_KEY@" + MY_VERSION;
var evStore = EvStore$1;
function EvStore$1(elem) {
  var hash = elem[hashKey];
  if (!hash) {
    hash = elem[hashKey] = {};
  }
  return hash;
}
var EvStore = evStore;
var evHook$1 = EvHook;
function EvHook(value) {
  if (!(this instanceof EvHook)) {
    return new EvHook(value);
  }
  this.value = value;
}
EvHook.prototype.hook = function(node2, propertyName) {
  var es = EvStore(node2);
  var propName = propertyName.substr(3);
  es[propName] = this.value;
};
EvHook.prototype.unhook = function(node2, propertyName) {
  var es = EvStore(node2);
  var propName = propertyName.substr(3);
  es[propName] = void 0;
};
var isArray = xIsArray;
var VNode$1 = vnode;
var VText$1 = vtext;
var isVNode = isVnode;
var isVText = isVtext;
var isWidget = isWidget_1;
var isHook = isVhook;
var isVThunk = isThunk_1;
var parseTag = parseTag_1;
var softSetHook = softSetHook$1;
var evHook = evHook$1;
var virtualHyperscript = h$2;
function h$2(tagName, properties, children) {
  var childNodes = [];
  var tag, props, key, namespace;
  if (!children && isChildren(properties)) {
    children = properties;
    props = {};
  }
  props = props || properties || {};
  tag = parseTag(tagName, props);
  if (props.hasOwnProperty("key")) {
    key = props.key;
    props.key = void 0;
  }
  if (props.hasOwnProperty("namespace")) {
    namespace = props.namespace;
    props.namespace = void 0;
  }
  if (tag === "INPUT" && !namespace && props.hasOwnProperty("value") && props.value !== void 0 && !isHook(props.value)) {
    props.value = softSetHook(props.value);
  }
  transformProperties(props);
  if (children !== void 0 && children !== null) {
    addChild(children, childNodes, tag, props);
  }
  return new VNode$1(tag, props, childNodes, key, namespace);
}
function addChild(c, childNodes, tag, props) {
  if (typeof c === "string") {
    childNodes.push(new VText$1(c));
  } else if (typeof c === "number") {
    childNodes.push(new VText$1(String(c)));
  } else if (isChild(c)) {
    childNodes.push(c);
  } else if (isArray(c)) {
    for (var i2 = 0; i2 < c.length; i2++) {
      addChild(c[i2], childNodes, tag, props);
    }
  } else if (c === null || c === void 0) {
    return;
  } else {
    throw UnexpectedVirtualElement({
      foreignObject: c,
      parentVnode: {
        tagName: tag,
        properties: props
      }
    });
  }
}
function transformProperties(props) {
  for (var propName in props) {
    if (props.hasOwnProperty(propName)) {
      var value = props[propName];
      if (isHook(value)) {
        continue;
      }
      if (propName.substr(0, 3) === "ev-") {
        props[propName] = evHook(value);
      }
    }
  }
}
function isChild(x) {
  return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}
function isChildren(x) {
  return typeof x === "string" || isArray(x) || isChild(x);
}
function UnexpectedVirtualElement(data) {
  var err = new Error();
  err.type = "virtual-hyperscript.unexpected.virtual-element";
  err.message = "Unexpected virtual child passed to h().\nExpected a VNode / Vthunk / VWidget / string but:\ngot:\n" + errorString(data.foreignObject) + ".\nThe parent vnode is:\n" + errorString(data.parentVnode);
  err.foreignObject = data.foreignObject;
  err.parentVnode = data.parentVnode;
  return err;
}
function errorString(obj) {
  try {
    return JSON.stringify(obj, null, "    ");
  } catch (e) {
    return String(obj);
  }
}
var h$1 = virtualHyperscript;
var h_1 = h$1;
var createElement = createElement_1$1;
var createElement_1 = createElement;
var diff = diff_1;
var patch = patch_1;
var h = h_1;
var create = createElement_1;
var VNode = vnode;
var VText = vtext;
var virtualDom = {
  diff,
  patch,
  h,
  create,
  VNode,
  VText
};
var ent = {};
var punycode$2 = { exports: {} };
/*! https://mths.be/punycode v1.4.1 by @mathias */
(function(module, exports) {
  (function(root2) {
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = module && !module.nodeType && module;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
      root2 = freeGlobal;
    }
    var punycode2, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
      "overflow": "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, baseMinusTMin = base - tMin, floor2 = Math.floor, stringFromCharCode = String.fromCharCode, key;
    function error(type2) {
      throw new RangeError(errors[type2]);
    }
    function map2(array, fn2) {
      var length = array.length;
      var result = [];
      while (length--) {
        result[length] = fn2(array[length]);
      }
      return result;
    }
    function mapDomain(string, fn2) {
      var parts = string.split("@");
      var result = "";
      if (parts.length > 1) {
        result = parts[0] + "@";
        string = parts[1];
      }
      string = string.replace(regexSeparators, ".");
      var labels = string.split(".");
      var encoded = map2(labels, fn2).join(".");
      return result + encoded;
    }
    function ucs2decode(string) {
      var output = [], counter = 0, length = string.length, value, extra;
      while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
          extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
    function ucs2encode(array) {
      return map2(array, function(value) {
        var output = "";
        if (value > 65535) {
          value -= 65536;
          output += stringFromCharCode(value >>> 10 & 1023 | 55296);
          value = 56320 | value & 1023;
        }
        output += stringFromCharCode(value);
        return output;
      }).join("");
    }
    function basicToDigit(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }
      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }
      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }
      return base;
    }
    function digitToBasic(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }
    function adapt(delta2, numPoints, firstTime) {
      var k = 0;
      delta2 = firstTime ? floor2(delta2 / damp) : delta2 >> 1;
      delta2 += floor2(delta2 / numPoints);
      for (; delta2 > baseMinusTMin * tMax >> 1; k += base) {
        delta2 = floor2(delta2 / baseMinusTMin);
      }
      return floor2(k + (baseMinusTMin + 1) * delta2 / (delta2 + skew));
    }
    function decode3(input) {
      var output = [], inputLength = input.length, out, i2 = 0, n = initialN, bias = initialBias, basic, j2, index, oldi, w, k, digit, t, baseMinusT;
      basic = input.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (j2 = 0; j2 < basic; ++j2) {
        if (input.charCodeAt(j2) >= 128) {
          error("not-basic");
        }
        output.push(input.charCodeAt(j2));
      }
      for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
        for (oldi = i2, w = 1, k = base; ; k += base) {
          if (index >= inputLength) {
            error("invalid-input");
          }
          digit = basicToDigit(input.charCodeAt(index++));
          if (digit >= base || digit > floor2((maxInt - i2) / w)) {
            error("overflow");
          }
          i2 += digit * w;
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (digit < t) {
            break;
          }
          baseMinusT = base - t;
          if (w > floor2(maxInt / baseMinusT)) {
            error("overflow");
          }
          w *= baseMinusT;
        }
        out = output.length + 1;
        bias = adapt(i2 - oldi, out, oldi == 0);
        if (floor2(i2 / out) > maxInt - n) {
          error("overflow");
        }
        n += floor2(i2 / out);
        i2 %= out;
        output.splice(i2++, 0, n);
      }
      return ucs2encode(output);
    }
    function encode3(input) {
      var n, delta2, handledCPCount, basicLength, bias, j2, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
      input = ucs2decode(input);
      inputLength = input.length;
      n = initialN;
      delta2 = 0;
      bias = initialBias;
      for (j2 = 0; j2 < inputLength; ++j2) {
        currentValue = input[j2];
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      handledCPCount = basicLength = output.length;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        for (m = maxInt, j2 = 0; j2 < inputLength; ++j2) {
          currentValue = input[j2];
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }
        handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor2((maxInt - delta2) / handledCPCountPlusOne)) {
          error("overflow");
        }
        delta2 += (m - n) * handledCPCountPlusOne;
        n = m;
        for (j2 = 0; j2 < inputLength; ++j2) {
          currentValue = input[j2];
          if (currentValue < n && ++delta2 > maxInt) {
            error("overflow");
          }
          if (currentValue == n) {
            for (q = delta2, k = base; ; k += base) {
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (q < t) {
                break;
              }
              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(
                stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
              );
              q = floor2(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta2, handledCPCountPlusOne, handledCPCount == basicLength);
            delta2 = 0;
            ++handledCPCount;
          }
        }
        ++delta2;
        ++n;
      }
      return output.join("");
    }
    function toUnicode(input) {
      return mapDomain(input, function(string) {
        return regexPunycode.test(string) ? decode3(string.slice(4).toLowerCase()) : string;
      });
    }
    function toASCII(input) {
      return mapDomain(input, function(string) {
        return regexNonASCII.test(string) ? "xn--" + encode3(string) : string;
      });
    }
    punycode2 = {
      "version": "1.4.1",
      "ucs2": {
        "decode": ucs2decode,
        "encode": ucs2encode
      },
      "decode": decode3,
      "encode": encode3,
      "toASCII": toASCII,
      "toUnicode": toUnicode
    };
    if (freeExports && freeModule) {
      if (module.exports == freeExports) {
        freeModule.exports = punycode2;
      } else {
        for (key in punycode2) {
          punycode2.hasOwnProperty(key) && (freeExports[key] = punycode2[key]);
        }
      }
    } else {
      root2.punycode = punycode2;
    }
  })(commonjsGlobal);
})(punycode$2, punycode$2.exports);
var type = TypeError;
var esObjectAtoms = Object;
var esErrors = Error;
var _eval = EvalError;
var range$2 = RangeError;
var ref = ReferenceError;
var syntax = SyntaxError;
var uri = URIError;
var abs$1 = Math.abs;
var floor$1 = Math.floor;
var max$2 = Math.max;
var min$1 = Math.min;
var pow$1 = Math.pow;
var round$1 = Math.round;
var _isNaN = Number.isNaN || function isNaN2(a) {
  return a !== a;
};
var $isNaN = _isNaN;
var sign$1 = function sign(number) {
  if ($isNaN(number) || number === 0) {
    return number;
  }
  return number < 0 ? -1 : 1;
};
var gOPD$1 = Object.getOwnPropertyDescriptor;
var $gOPD$1 = gOPD$1;
if ($gOPD$1) {
  try {
    $gOPD$1([], "length");
  } catch (e) {
    $gOPD$1 = null;
  }
}
var gopd = $gOPD$1;
var $defineProperty$1 = Object.defineProperty || false;
if ($defineProperty$1) {
  try {
    $defineProperty$1({}, "a", { value: 1 });
  } catch (e) {
    $defineProperty$1 = false;
  }
}
var esDefineProperty = $defineProperty$1;
var shams$1 = function hasSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }
  if (typeof Symbol.iterator === "symbol") {
    return true;
  }
  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === "string") {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
    return false;
  }
  var symVal = 42;
  obj[sym] = symVal;
  for (var _ in obj) {
    return false;
  }
  if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === "function") {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
var hasSymbols$2;
var hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols)
    return hasSymbols$2;
  hasRequiredHasSymbols = 1;
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = shams$1;
  hasSymbols$2 = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
  return hasSymbols$2;
}
var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  if (hasRequiredReflect_getPrototypeOf)
    return Reflect_getPrototypeOf;
  hasRequiredReflect_getPrototypeOf = 1;
  Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  return Reflect_getPrototypeOf;
}
var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf)
    return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var $Object2 = esObjectAtoms;
  Object_getPrototypeOf = $Object2.getPrototypeOf || null;
  return Object_getPrototypeOf;
}
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var toStr = Object.prototype.toString;
var max$1 = Math.max;
var funcType = "[object Function]";
var concatty = function concatty2(a, b) {
  var arr = [];
  for (var i2 = 0; i2 < a.length; i2 += 1) {
    arr[i2] = a[i2];
  }
  for (var j2 = 0; j2 < b.length; j2 += 1) {
    arr[j2 + a.length] = b[j2];
  }
  return arr;
};
var slicy = function slicy2(arrLike, offset) {
  var arr = [];
  for (var i2 = offset || 0, j2 = 0; i2 < arrLike.length; i2 += 1, j2 += 1) {
    arr[j2] = arrLike[i2];
  }
  return arr;
};
var joiny = function(arr, joiner) {
  var str = "";
  for (var i2 = 0; i2 < arr.length; i2 += 1) {
    str += arr[i2];
    if (i2 + 1 < arr.length) {
      str += joiner;
    }
  }
  return str;
};
var implementation$1 = function bind(that) {
  var target2 = this;
  if (typeof target2 !== "function" || toStr.apply(target2) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target2);
  }
  var args = slicy(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target2.apply(
        this,
        concatty(args, arguments)
      );
      if (Object(result) === result) {
        return result;
      }
      return this;
    }
    return target2.apply(
      that,
      concatty(args, arguments)
    );
  };
  var boundLength = max$1(0, target2.length - args.length);
  var boundArgs = [];
  for (var i2 = 0; i2 < boundLength; i2++) {
    boundArgs[i2] = "$" + i2;
  }
  bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target2.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target2.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};
var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;
var functionCall = Function.prototype.call;
var functionApply = Function.prototype.apply;
var reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
var bind$3 = functionBind;
var $apply$1 = functionApply;
var $call$2 = functionCall;
var $reflectApply = reflectApply;
var actualApply = $reflectApply || bind$3.call($call$2, $apply$1);
var bind$2 = functionBind;
var $TypeError$4 = type;
var $call$1 = functionCall;
var $actualApply = actualApply;
var callBindApplyHelpers = function callBindBasic(args) {
  if (args.length < 1 || typeof args[0] !== "function") {
    throw new $TypeError$4("a function is required");
  }
  return $actualApply(bind$2, $call$1, args);
};
var get;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet)
    return get;
  hasRequiredGet = 1;
  var callBind = callBindApplyHelpers;
  var gOPD2 = gopd;
  var hasProtoAccessor;
  try {
    hasProtoAccessor = [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD2 && gOPD2(Object.prototype, "__proto__");
  var $Object2 = Object;
  var $getPrototypeOf = $Object2.getPrototypeOf;
  get = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
    return $getPrototypeOf(value == null ? value : $Object2(value));
  } : false;
  return get;
}
var getProto$1;
var hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto)
    return getProto$1;
  hasRequiredGetProto = 1;
  var reflectGetProto = requireReflect_getPrototypeOf();
  var originalGetProto = requireObject_getPrototypeOf();
  var getDunderProto = requireGet();
  getProto$1 = reflectGetProto ? function getProto2(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto2(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto2(O) {
    return getDunderProto(O);
  } : null;
  return getProto$1;
}
var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind$1 = functionBind;
var hasown = bind$1.call(call, $hasOwn);
var undefined$1;
var $Object = esObjectAtoms;
var $Error = esErrors;
var $EvalError = _eval;
var $RangeError = range$2;
var $ReferenceError = ref;
var $SyntaxError = syntax;
var $TypeError$3 = type;
var $URIError = uri;
var abs = abs$1;
var floor = floor$1;
var max = max$2;
var min = min$1;
var pow = pow$1;
var round = round$1;
var sign2 = sign$1;
var $Function = Function;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = gopd;
var $defineProperty = esDefineProperty;
var throwTypeError = function() {
  throw new $TypeError$3();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols$1 = requireHasSymbols()();
var getProto = requireGetProto();
var $ObjectGPO = requireObject_getPrototypeOf();
var $ReflectGPO = requireReflect_getPrototypeOf();
var $apply = functionApply;
var $call = functionCall;
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols$1 && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": $Error,
  "%eval%": eval,
  "%EvalError%": $EvalError,
  "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols$1 && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols$1 || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": $Object,
  "%Object.getOwnPropertyDescriptor%": $gOPD,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": $RangeError,
  "%ReferenceError%": $ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols$1 || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols$1 && getProto ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols$1 ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$3,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": $URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
  "%Function.prototype.call%": $call,
  "%Function.prototype.apply%": $apply,
  "%Object.defineProperty%": $defineProperty,
  "%Object.getPrototypeOf%": $ObjectGPO,
  "%Math.abs%": abs,
  "%Math.floor%": floor,
  "%Math.max%": max,
  "%Math.min%": min,
  "%Math.pow%": pow,
  "%Math.round%": round,
  "%Math.sign%": sign2,
  "%Reflect.getPrototypeOf%": $ReflectGPO
};
if (getProto) {
  try {
    null.error;
  } catch (e) {
    var errorProto = getProto(getProto(e));
    INTRINSICS["%Error.prototype%"] = errorProto;
  }
}
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn2 = doEval2("%AsyncGeneratorFunction%");
    if (fn2) {
      value = fn2.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind2 = functionBind;
var hasOwn$1 = hasown;
var $concat = bind2.call($call, Array.prototype.concat);
var $spliceApply = bind2.call($apply, Array.prototype.splice);
var $replace$1 = bind2.call($call, String.prototype.replace);
var $strSlice = bind2.call($call, String.prototype.slice);
var $exec$3 = bind2.call($call, RegExp.prototype.exec);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace$1(string, rePropName, function(match, number, quote, subString) {
    result[result.length] = quote ? $replace$1(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$1(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$3("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$3("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$3('"allowMissing" argument must be a boolean');
  }
  if ($exec$3(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i2 = 1, isOwn = true; i2 < parts.length; i2 += 1) {
    var part2 = parts[i2];
    var first = $strSlice(part2, 0, 1);
    var last = $strSlice(part2, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part2 === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part2;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part2 in value)) {
        if (!allowMissing) {
          throw new $TypeError$3("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i2 + 1 >= parts.length) {
        var desc = $gOPD(value, part2);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part2];
        }
      } else {
        isOwn = hasOwn$1(value, part2);
        value = value[part2];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var GetIntrinsic2 = getIntrinsic;
var callBindBasic2 = callBindApplyHelpers;
var $indexOf = callBindBasic2([GetIntrinsic2("%String.prototype.indexOf%")]);
var callBound$3 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic2(name, !!allowMissing);
  if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
    return callBindBasic2([intrinsic]);
  }
  return intrinsic;
};
var hasSymbols2 = shams$1;
var shams = function hasToStringTagShams() {
  return hasSymbols2() && !!Symbol.toStringTag;
};
var callBound$2 = callBound$3;
var hasToStringTag = shams();
var hasOwn = hasown;
var gOPD = gopd;
var fn;
if (hasToStringTag) {
  var $exec$2 = callBound$2("RegExp.prototype.exec");
  var isRegexMarker = {};
  var throwRegexMarker = function() {
    throw isRegexMarker;
  };
  var badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker
  };
  if (typeof Symbol.toPrimitive === "symbol") {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }
  fn = function isRegex2(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    var descriptor = gOPD(value, "lastIndex");
    var hasLastIndexDataProperty = descriptor && hasOwn(descriptor, "value");
    if (!hasLastIndexDataProperty) {
      return false;
    }
    try {
      $exec$2(value, badStringifier);
    } catch (e) {
      return e === isRegexMarker;
    }
  };
} else {
  var $toString = callBound$2("Object.prototype.toString");
  var regexClass = "[object RegExp]";
  fn = function isRegex2(value) {
    if (!value || typeof value !== "object" && typeof value !== "function") {
      return false;
    }
    return $toString(value) === regexClass;
  };
}
var isRegex$1 = fn;
var callBound$1 = callBound$3;
var isRegex = isRegex$1;
var $exec$1 = callBound$1("RegExp.prototype.exec");
var $TypeError$2 = type;
var safeRegexTest = function regexTester(regex) {
  if (!isRegex(regex)) {
    throw new $TypeError$2("`regex` must be a RegExp");
  }
  return function test(s) {
    return $exec$1(regex, s) !== null;
  };
};
const require$$3$1 = {
  "9": "Tab;",
  "10": "NewLine;",
  "33": "excl;",
  "34": "quot;",
  "35": "num;",
  "36": "dollar;",
  "37": "percnt;",
  "38": "amp;",
  "39": "apos;",
  "40": "lpar;",
  "41": "rpar;",
  "42": "midast;",
  "43": "plus;",
  "44": "comma;",
  "46": "period;",
  "47": "sol;",
  "58": "colon;",
  "59": "semi;",
  "60": "lt;",
  "61": "equals;",
  "62": "gt;",
  "63": "quest;",
  "64": "commat;",
  "91": "lsqb;",
  "92": "bsol;",
  "93": "rsqb;",
  "94": "Hat;",
  "95": "UnderBar;",
  "96": "grave;",
  "123": "lcub;",
  "124": "VerticalLine;",
  "125": "rcub;",
  "160": "NonBreakingSpace;",
  "161": "iexcl;",
  "162": "cent;",
  "163": "pound;",
  "164": "curren;",
  "165": "yen;",
  "166": "brvbar;",
  "167": "sect;",
  "168": "uml;",
  "169": "copy;",
  "170": "ordf;",
  "171": "laquo;",
  "172": "not;",
  "173": "shy;",
  "174": "reg;",
  "175": "strns;",
  "176": "deg;",
  "177": "pm;",
  "178": "sup2;",
  "179": "sup3;",
  "180": "DiacriticalAcute;",
  "181": "micro;",
  "182": "para;",
  "183": "middot;",
  "184": "Cedilla;",
  "185": "sup1;",
  "186": "ordm;",
  "187": "raquo;",
  "188": "frac14;",
  "189": "half;",
  "190": "frac34;",
  "191": "iquest;",
  "192": "Agrave;",
  "193": "Aacute;",
  "194": "Acirc;",
  "195": "Atilde;",
  "196": "Auml;",
  "197": "Aring;",
  "198": "AElig;",
  "199": "Ccedil;",
  "200": "Egrave;",
  "201": "Eacute;",
  "202": "Ecirc;",
  "203": "Euml;",
  "204": "Igrave;",
  "205": "Iacute;",
  "206": "Icirc;",
  "207": "Iuml;",
  "208": "ETH;",
  "209": "Ntilde;",
  "210": "Ograve;",
  "211": "Oacute;",
  "212": "Ocirc;",
  "213": "Otilde;",
  "214": "Ouml;",
  "215": "times;",
  "216": "Oslash;",
  "217": "Ugrave;",
  "218": "Uacute;",
  "219": "Ucirc;",
  "220": "Uuml;",
  "221": "Yacute;",
  "222": "THORN;",
  "223": "szlig;",
  "224": "agrave;",
  "225": "aacute;",
  "226": "acirc;",
  "227": "atilde;",
  "228": "auml;",
  "229": "aring;",
  "230": "aelig;",
  "231": "ccedil;",
  "232": "egrave;",
  "233": "eacute;",
  "234": "ecirc;",
  "235": "euml;",
  "236": "igrave;",
  "237": "iacute;",
  "238": "icirc;",
  "239": "iuml;",
  "240": "eth;",
  "241": "ntilde;",
  "242": "ograve;",
  "243": "oacute;",
  "244": "ocirc;",
  "245": "otilde;",
  "246": "ouml;",
  "247": "divide;",
  "248": "oslash;",
  "249": "ugrave;",
  "250": "uacute;",
  "251": "ucirc;",
  "252": "uuml;",
  "253": "yacute;",
  "254": "thorn;",
  "255": "yuml;",
  "256": "Amacr;",
  "257": "amacr;",
  "258": "Abreve;",
  "259": "abreve;",
  "260": "Aogon;",
  "261": "aogon;",
  "262": "Cacute;",
  "263": "cacute;",
  "264": "Ccirc;",
  "265": "ccirc;",
  "266": "Cdot;",
  "267": "cdot;",
  "268": "Ccaron;",
  "269": "ccaron;",
  "270": "Dcaron;",
  "271": "dcaron;",
  "272": "Dstrok;",
  "273": "dstrok;",
  "274": "Emacr;",
  "275": "emacr;",
  "278": "Edot;",
  "279": "edot;",
  "280": "Eogon;",
  "281": "eogon;",
  "282": "Ecaron;",
  "283": "ecaron;",
  "284": "Gcirc;",
  "285": "gcirc;",
  "286": "Gbreve;",
  "287": "gbreve;",
  "288": "Gdot;",
  "289": "gdot;",
  "290": "Gcedil;",
  "292": "Hcirc;",
  "293": "hcirc;",
  "294": "Hstrok;",
  "295": "hstrok;",
  "296": "Itilde;",
  "297": "itilde;",
  "298": "Imacr;",
  "299": "imacr;",
  "302": "Iogon;",
  "303": "iogon;",
  "304": "Idot;",
  "305": "inodot;",
  "306": "IJlig;",
  "307": "ijlig;",
  "308": "Jcirc;",
  "309": "jcirc;",
  "310": "Kcedil;",
  "311": "kcedil;",
  "312": "kgreen;",
  "313": "Lacute;",
  "314": "lacute;",
  "315": "Lcedil;",
  "316": "lcedil;",
  "317": "Lcaron;",
  "318": "lcaron;",
  "319": "Lmidot;",
  "320": "lmidot;",
  "321": "Lstrok;",
  "322": "lstrok;",
  "323": "Nacute;",
  "324": "nacute;",
  "325": "Ncedil;",
  "326": "ncedil;",
  "327": "Ncaron;",
  "328": "ncaron;",
  "329": "napos;",
  "330": "ENG;",
  "331": "eng;",
  "332": "Omacr;",
  "333": "omacr;",
  "336": "Odblac;",
  "337": "odblac;",
  "338": "OElig;",
  "339": "oelig;",
  "340": "Racute;",
  "341": "racute;",
  "342": "Rcedil;",
  "343": "rcedil;",
  "344": "Rcaron;",
  "345": "rcaron;",
  "346": "Sacute;",
  "347": "sacute;",
  "348": "Scirc;",
  "349": "scirc;",
  "350": "Scedil;",
  "351": "scedil;",
  "352": "Scaron;",
  "353": "scaron;",
  "354": "Tcedil;",
  "355": "tcedil;",
  "356": "Tcaron;",
  "357": "tcaron;",
  "358": "Tstrok;",
  "359": "tstrok;",
  "360": "Utilde;",
  "361": "utilde;",
  "362": "Umacr;",
  "363": "umacr;",
  "364": "Ubreve;",
  "365": "ubreve;",
  "366": "Uring;",
  "367": "uring;",
  "368": "Udblac;",
  "369": "udblac;",
  "370": "Uogon;",
  "371": "uogon;",
  "372": "Wcirc;",
  "373": "wcirc;",
  "374": "Ycirc;",
  "375": "ycirc;",
  "376": "Yuml;",
  "377": "Zacute;",
  "378": "zacute;",
  "379": "Zdot;",
  "380": "zdot;",
  "381": "Zcaron;",
  "382": "zcaron;",
  "402": "fnof;",
  "437": "imped;",
  "501": "gacute;",
  "567": "jmath;",
  "710": "circ;",
  "711": "Hacek;",
  "728": "breve;",
  "729": "dot;",
  "730": "ring;",
  "731": "ogon;",
  "732": "tilde;",
  "733": "DiacriticalDoubleAcute;",
  "785": "DownBreve;",
  "913": "Alpha;",
  "914": "Beta;",
  "915": "Gamma;",
  "916": "Delta;",
  "917": "Epsilon;",
  "918": "Zeta;",
  "919": "Eta;",
  "920": "Theta;",
  "921": "Iota;",
  "922": "Kappa;",
  "923": "Lambda;",
  "924": "Mu;",
  "925": "Nu;",
  "926": "Xi;",
  "927": "Omicron;",
  "928": "Pi;",
  "929": "Rho;",
  "931": "Sigma;",
  "932": "Tau;",
  "933": "Upsilon;",
  "934": "Phi;",
  "935": "Chi;",
  "936": "Psi;",
  "937": "Omega;",
  "945": "alpha;",
  "946": "beta;",
  "947": "gamma;",
  "948": "delta;",
  "949": "epsilon;",
  "950": "zeta;",
  "951": "eta;",
  "952": "theta;",
  "953": "iota;",
  "954": "kappa;",
  "955": "lambda;",
  "956": "mu;",
  "957": "nu;",
  "958": "xi;",
  "959": "omicron;",
  "960": "pi;",
  "961": "rho;",
  "962": "varsigma;",
  "963": "sigma;",
  "964": "tau;",
  "965": "upsilon;",
  "966": "phi;",
  "967": "chi;",
  "968": "psi;",
  "969": "omega;",
  "977": "vartheta;",
  "978": "upsih;",
  "981": "varphi;",
  "982": "varpi;",
  "988": "Gammad;",
  "989": "gammad;",
  "1008": "varkappa;",
  "1009": "varrho;",
  "1013": "varepsilon;",
  "1014": "bepsi;",
  "1025": "IOcy;",
  "1026": "DJcy;",
  "1027": "GJcy;",
  "1028": "Jukcy;",
  "1029": "DScy;",
  "1030": "Iukcy;",
  "1031": "YIcy;",
  "1032": "Jsercy;",
  "1033": "LJcy;",
  "1034": "NJcy;",
  "1035": "TSHcy;",
  "1036": "KJcy;",
  "1038": "Ubrcy;",
  "1039": "DZcy;",
  "1040": "Acy;",
  "1041": "Bcy;",
  "1042": "Vcy;",
  "1043": "Gcy;",
  "1044": "Dcy;",
  "1045": "IEcy;",
  "1046": "ZHcy;",
  "1047": "Zcy;",
  "1048": "Icy;",
  "1049": "Jcy;",
  "1050": "Kcy;",
  "1051": "Lcy;",
  "1052": "Mcy;",
  "1053": "Ncy;",
  "1054": "Ocy;",
  "1055": "Pcy;",
  "1056": "Rcy;",
  "1057": "Scy;",
  "1058": "Tcy;",
  "1059": "Ucy;",
  "1060": "Fcy;",
  "1061": "KHcy;",
  "1062": "TScy;",
  "1063": "CHcy;",
  "1064": "SHcy;",
  "1065": "SHCHcy;",
  "1066": "HARDcy;",
  "1067": "Ycy;",
  "1068": "SOFTcy;",
  "1069": "Ecy;",
  "1070": "YUcy;",
  "1071": "YAcy;",
  "1072": "acy;",
  "1073": "bcy;",
  "1074": "vcy;",
  "1075": "gcy;",
  "1076": "dcy;",
  "1077": "iecy;",
  "1078": "zhcy;",
  "1079": "zcy;",
  "1080": "icy;",
  "1081": "jcy;",
  "1082": "kcy;",
  "1083": "lcy;",
  "1084": "mcy;",
  "1085": "ncy;",
  "1086": "ocy;",
  "1087": "pcy;",
  "1088": "rcy;",
  "1089": "scy;",
  "1090": "tcy;",
  "1091": "ucy;",
  "1092": "fcy;",
  "1093": "khcy;",
  "1094": "tscy;",
  "1095": "chcy;",
  "1096": "shcy;",
  "1097": "shchcy;",
  "1098": "hardcy;",
  "1099": "ycy;",
  "1100": "softcy;",
  "1101": "ecy;",
  "1102": "yucy;",
  "1103": "yacy;",
  "1105": "iocy;",
  "1106": "djcy;",
  "1107": "gjcy;",
  "1108": "jukcy;",
  "1109": "dscy;",
  "1110": "iukcy;",
  "1111": "yicy;",
  "1112": "jsercy;",
  "1113": "ljcy;",
  "1114": "njcy;",
  "1115": "tshcy;",
  "1116": "kjcy;",
  "1118": "ubrcy;",
  "1119": "dzcy;",
  "8194": "ensp;",
  "8195": "emsp;",
  "8196": "emsp13;",
  "8197": "emsp14;",
  "8199": "numsp;",
  "8200": "puncsp;",
  "8201": "ThinSpace;",
  "8202": "VeryThinSpace;",
  "8203": "ZeroWidthSpace;",
  "8204": "zwnj;",
  "8205": "zwj;",
  "8206": "lrm;",
  "8207": "rlm;",
  "8208": "hyphen;",
  "8211": "ndash;",
  "8212": "mdash;",
  "8213": "horbar;",
  "8214": "Vert;",
  "8216": "OpenCurlyQuote;",
  "8217": "rsquor;",
  "8218": "sbquo;",
  "8220": "OpenCurlyDoubleQuote;",
  "8221": "rdquor;",
  "8222": "ldquor;",
  "8224": "dagger;",
  "8225": "ddagger;",
  "8226": "bullet;",
  "8229": "nldr;",
  "8230": "mldr;",
  "8240": "permil;",
  "8241": "pertenk;",
  "8242": "prime;",
  "8243": "Prime;",
  "8244": "tprime;",
  "8245": "bprime;",
  "8249": "lsaquo;",
  "8250": "rsaquo;",
  "8254": "OverBar;",
  "8257": "caret;",
  "8259": "hybull;",
  "8260": "frasl;",
  "8271": "bsemi;",
  "8279": "qprime;",
  "8287": "MediumSpace;",
  "8288": "NoBreak;",
  "8289": "ApplyFunction;",
  "8290": "it;",
  "8291": "InvisibleComma;",
  "8364": "euro;",
  "8411": "TripleDot;",
  "8412": "DotDot;",
  "8450": "Copf;",
  "8453": "incare;",
  "8458": "gscr;",
  "8459": "Hscr;",
  "8460": "Poincareplane;",
  "8461": "quaternions;",
  "8462": "planckh;",
  "8463": "plankv;",
  "8464": "Iscr;",
  "8465": "imagpart;",
  "8466": "Lscr;",
  "8467": "ell;",
  "8469": "Nopf;",
  "8470": "numero;",
  "8471": "copysr;",
  "8472": "wp;",
  "8473": "primes;",
  "8474": "rationals;",
  "8475": "Rscr;",
  "8476": "Rfr;",
  "8477": "Ropf;",
  "8478": "rx;",
  "8482": "trade;",
  "8484": "Zopf;",
  "8487": "mho;",
  "8488": "Zfr;",
  "8489": "iiota;",
  "8492": "Bscr;",
  "8493": "Cfr;",
  "8495": "escr;",
  "8496": "expectation;",
  "8497": "Fscr;",
  "8499": "phmmat;",
  "8500": "oscr;",
  "8501": "aleph;",
  "8502": "beth;",
  "8503": "gimel;",
  "8504": "daleth;",
  "8517": "DD;",
  "8518": "DifferentialD;",
  "8519": "exponentiale;",
  "8520": "ImaginaryI;",
  "8531": "frac13;",
  "8532": "frac23;",
  "8533": "frac15;",
  "8534": "frac25;",
  "8535": "frac35;",
  "8536": "frac45;",
  "8537": "frac16;",
  "8538": "frac56;",
  "8539": "frac18;",
  "8540": "frac38;",
  "8541": "frac58;",
  "8542": "frac78;",
  "8592": "slarr;",
  "8593": "uparrow;",
  "8594": "srarr;",
  "8595": "ShortDownArrow;",
  "8596": "leftrightarrow;",
  "8597": "varr;",
  "8598": "UpperLeftArrow;",
  "8599": "UpperRightArrow;",
  "8600": "searrow;",
  "8601": "swarrow;",
  "8602": "nleftarrow;",
  "8603": "nrightarrow;",
  "8605": "rightsquigarrow;",
  "8606": "twoheadleftarrow;",
  "8607": "Uarr;",
  "8608": "twoheadrightarrow;",
  "8609": "Darr;",
  "8610": "leftarrowtail;",
  "8611": "rightarrowtail;",
  "8612": "mapstoleft;",
  "8613": "UpTeeArrow;",
  "8614": "RightTeeArrow;",
  "8615": "mapstodown;",
  "8617": "larrhk;",
  "8618": "rarrhk;",
  "8619": "looparrowleft;",
  "8620": "rarrlp;",
  "8621": "leftrightsquigarrow;",
  "8622": "nleftrightarrow;",
  "8624": "lsh;",
  "8625": "rsh;",
  "8626": "ldsh;",
  "8627": "rdsh;",
  "8629": "crarr;",
  "8630": "curvearrowleft;",
  "8631": "curvearrowright;",
  "8634": "olarr;",
  "8635": "orarr;",
  "8636": "lharu;",
  "8637": "lhard;",
  "8638": "upharpoonright;",
  "8639": "upharpoonleft;",
  "8640": "RightVector;",
  "8641": "rightharpoondown;",
  "8642": "RightDownVector;",
  "8643": "LeftDownVector;",
  "8644": "rlarr;",
  "8645": "UpArrowDownArrow;",
  "8646": "lrarr;",
  "8647": "llarr;",
  "8648": "uuarr;",
  "8649": "rrarr;",
  "8650": "downdownarrows;",
  "8651": "ReverseEquilibrium;",
  "8652": "rlhar;",
  "8653": "nLeftarrow;",
  "8654": "nLeftrightarrow;",
  "8655": "nRightarrow;",
  "8656": "Leftarrow;",
  "8657": "Uparrow;",
  "8658": "Rightarrow;",
  "8659": "Downarrow;",
  "8660": "Leftrightarrow;",
  "8661": "vArr;",
  "8662": "nwArr;",
  "8663": "neArr;",
  "8664": "seArr;",
  "8665": "swArr;",
  "8666": "Lleftarrow;",
  "8667": "Rrightarrow;",
  "8669": "zigrarr;",
  "8676": "LeftArrowBar;",
  "8677": "RightArrowBar;",
  "8693": "duarr;",
  "8701": "loarr;",
  "8702": "roarr;",
  "8703": "hoarr;",
  "8704": "forall;",
  "8705": "complement;",
  "8706": "PartialD;",
  "8707": "Exists;",
  "8708": "NotExists;",
  "8709": "varnothing;",
  "8711": "nabla;",
  "8712": "isinv;",
  "8713": "notinva;",
  "8715": "SuchThat;",
  "8716": "NotReverseElement;",
  "8719": "Product;",
  "8720": "Coproduct;",
  "8721": "sum;",
  "8722": "minus;",
  "8723": "mp;",
  "8724": "plusdo;",
  "8726": "ssetmn;",
  "8727": "lowast;",
  "8728": "SmallCircle;",
  "8730": "Sqrt;",
  "8733": "vprop;",
  "8734": "infin;",
  "8735": "angrt;",
  "8736": "angle;",
  "8737": "measuredangle;",
  "8738": "angsph;",
  "8739": "VerticalBar;",
  "8740": "nsmid;",
  "8741": "spar;",
  "8742": "nspar;",
  "8743": "wedge;",
  "8744": "vee;",
  "8745": "cap;",
  "8746": "cup;",
  "8747": "Integral;",
  "8748": "Int;",
  "8749": "tint;",
  "8750": "oint;",
  "8751": "DoubleContourIntegral;",
  "8752": "Cconint;",
  "8753": "cwint;",
  "8754": "cwconint;",
  "8755": "CounterClockwiseContourIntegral;",
  "8756": "therefore;",
  "8757": "because;",
  "8758": "ratio;",
  "8759": "Proportion;",
  "8760": "minusd;",
  "8762": "mDDot;",
  "8763": "homtht;",
  "8764": "Tilde;",
  "8765": "bsim;",
  "8766": "mstpos;",
  "8767": "acd;",
  "8768": "wreath;",
  "8769": "nsim;",
  "8770": "esim;",
  "8771": "TildeEqual;",
  "8772": "nsimeq;",
  "8773": "TildeFullEqual;",
  "8774": "simne;",
  "8775": "NotTildeFullEqual;",
  "8776": "TildeTilde;",
  "8777": "NotTildeTilde;",
  "8778": "approxeq;",
  "8779": "apid;",
  "8780": "bcong;",
  "8781": "CupCap;",
  "8782": "HumpDownHump;",
  "8783": "HumpEqual;",
  "8784": "esdot;",
  "8785": "eDot;",
  "8786": "fallingdotseq;",
  "8787": "risingdotseq;",
  "8788": "coloneq;",
  "8789": "eqcolon;",
  "8790": "eqcirc;",
  "8791": "cire;",
  "8793": "wedgeq;",
  "8794": "veeeq;",
  "8796": "trie;",
  "8799": "questeq;",
  "8800": "NotEqual;",
  "8801": "equiv;",
  "8802": "NotCongruent;",
  "8804": "leq;",
  "8805": "GreaterEqual;",
  "8806": "LessFullEqual;",
  "8807": "GreaterFullEqual;",
  "8808": "lneqq;",
  "8809": "gneqq;",
  "8810": "NestedLessLess;",
  "8811": "NestedGreaterGreater;",
  "8812": "twixt;",
  "8813": "NotCupCap;",
  "8814": "NotLess;",
  "8815": "NotGreater;",
  "8816": "NotLessEqual;",
  "8817": "NotGreaterEqual;",
  "8818": "lsim;",
  "8819": "gtrsim;",
  "8820": "NotLessTilde;",
  "8821": "NotGreaterTilde;",
  "8822": "lg;",
  "8823": "gtrless;",
  "8824": "ntlg;",
  "8825": "ntgl;",
  "8826": "Precedes;",
  "8827": "Succeeds;",
  "8828": "PrecedesSlantEqual;",
  "8829": "SucceedsSlantEqual;",
  "8830": "prsim;",
  "8831": "succsim;",
  "8832": "nprec;",
  "8833": "nsucc;",
  "8834": "subset;",
  "8835": "supset;",
  "8836": "nsub;",
  "8837": "nsup;",
  "8838": "SubsetEqual;",
  "8839": "supseteq;",
  "8840": "nsubseteq;",
  "8841": "nsupseteq;",
  "8842": "subsetneq;",
  "8843": "supsetneq;",
  "8845": "cupdot;",
  "8846": "uplus;",
  "8847": "SquareSubset;",
  "8848": "SquareSuperset;",
  "8849": "SquareSubsetEqual;",
  "8850": "SquareSupersetEqual;",
  "8851": "SquareIntersection;",
  "8852": "SquareUnion;",
  "8853": "oplus;",
  "8854": "ominus;",
  "8855": "otimes;",
  "8856": "osol;",
  "8857": "odot;",
  "8858": "ocir;",
  "8859": "oast;",
  "8861": "odash;",
  "8862": "plusb;",
  "8863": "minusb;",
  "8864": "timesb;",
  "8865": "sdotb;",
  "8866": "vdash;",
  "8867": "LeftTee;",
  "8868": "top;",
  "8869": "UpTee;",
  "8871": "models;",
  "8872": "vDash;",
  "8873": "Vdash;",
  "8874": "Vvdash;",
  "8875": "VDash;",
  "8876": "nvdash;",
  "8877": "nvDash;",
  "8878": "nVdash;",
  "8879": "nVDash;",
  "8880": "prurel;",
  "8882": "vltri;",
  "8883": "vrtri;",
  "8884": "trianglelefteq;",
  "8885": "trianglerighteq;",
  "8886": "origof;",
  "8887": "imof;",
  "8888": "mumap;",
  "8889": "hercon;",
  "8890": "intercal;",
  "8891": "veebar;",
  "8893": "barvee;",
  "8894": "angrtvb;",
  "8895": "lrtri;",
  "8896": "xwedge;",
  "8897": "xvee;",
  "8898": "xcap;",
  "8899": "xcup;",
  "8900": "diamond;",
  "8901": "sdot;",
  "8902": "Star;",
  "8903": "divonx;",
  "8904": "bowtie;",
  "8905": "ltimes;",
  "8906": "rtimes;",
  "8907": "lthree;",
  "8908": "rthree;",
  "8909": "bsime;",
  "8910": "cuvee;",
  "8911": "cuwed;",
  "8912": "Subset;",
  "8913": "Supset;",
  "8914": "Cap;",
  "8915": "Cup;",
  "8916": "pitchfork;",
  "8917": "epar;",
  "8918": "ltdot;",
  "8919": "gtrdot;",
  "8920": "Ll;",
  "8921": "ggg;",
  "8922": "LessEqualGreater;",
  "8923": "gtreqless;",
  "8926": "curlyeqprec;",
  "8927": "curlyeqsucc;",
  "8928": "nprcue;",
  "8929": "nsccue;",
  "8930": "nsqsube;",
  "8931": "nsqsupe;",
  "8934": "lnsim;",
  "8935": "gnsim;",
  "8936": "prnsim;",
  "8937": "succnsim;",
  "8938": "ntriangleleft;",
  "8939": "ntriangleright;",
  "8940": "ntrianglelefteq;",
  "8941": "ntrianglerighteq;",
  "8942": "vellip;",
  "8943": "ctdot;",
  "8944": "utdot;",
  "8945": "dtdot;",
  "8946": "disin;",
  "8947": "isinsv;",
  "8948": "isins;",
  "8949": "isindot;",
  "8950": "notinvc;",
  "8951": "notinvb;",
  "8953": "isinE;",
  "8954": "nisd;",
  "8955": "xnis;",
  "8956": "nis;",
  "8957": "notnivc;",
  "8958": "notnivb;",
  "8965": "barwedge;",
  "8966": "doublebarwedge;",
  "8968": "LeftCeiling;",
  "8969": "RightCeiling;",
  "8970": "lfloor;",
  "8971": "RightFloor;",
  "8972": "drcrop;",
  "8973": "dlcrop;",
  "8974": "urcrop;",
  "8975": "ulcrop;",
  "8976": "bnot;",
  "8978": "profline;",
  "8979": "profsurf;",
  "8981": "telrec;",
  "8982": "target;",
  "8988": "ulcorner;",
  "8989": "urcorner;",
  "8990": "llcorner;",
  "8991": "lrcorner;",
  "8994": "sfrown;",
  "8995": "ssmile;",
  "9005": "cylcty;",
  "9006": "profalar;",
  "9014": "topbot;",
  "9021": "ovbar;",
  "9023": "solbar;",
  "9084": "angzarr;",
  "9136": "lmoustache;",
  "9137": "rmoustache;",
  "9140": "tbrk;",
  "9141": "UnderBracket;",
  "9142": "bbrktbrk;",
  "9180": "OverParenthesis;",
  "9181": "UnderParenthesis;",
  "9182": "OverBrace;",
  "9183": "UnderBrace;",
  "9186": "trpezium;",
  "9191": "elinters;",
  "9251": "blank;",
  "9416": "oS;",
  "9472": "HorizontalLine;",
  "9474": "boxv;",
  "9484": "boxdr;",
  "9488": "boxdl;",
  "9492": "boxur;",
  "9496": "boxul;",
  "9500": "boxvr;",
  "9508": "boxvl;",
  "9516": "boxhd;",
  "9524": "boxhu;",
  "9532": "boxvh;",
  "9552": "boxH;",
  "9553": "boxV;",
  "9554": "boxdR;",
  "9555": "boxDr;",
  "9556": "boxDR;",
  "9557": "boxdL;",
  "9558": "boxDl;",
  "9559": "boxDL;",
  "9560": "boxuR;",
  "9561": "boxUr;",
  "9562": "boxUR;",
  "9563": "boxuL;",
  "9564": "boxUl;",
  "9565": "boxUL;",
  "9566": "boxvR;",
  "9567": "boxVr;",
  "9568": "boxVR;",
  "9569": "boxvL;",
  "9570": "boxVl;",
  "9571": "boxVL;",
  "9572": "boxHd;",
  "9573": "boxhD;",
  "9574": "boxHD;",
  "9575": "boxHu;",
  "9576": "boxhU;",
  "9577": "boxHU;",
  "9578": "boxvH;",
  "9579": "boxVh;",
  "9580": "boxVH;",
  "9600": "uhblk;",
  "9604": "lhblk;",
  "9608": "block;",
  "9617": "blk14;",
  "9618": "blk12;",
  "9619": "blk34;",
  "9633": "square;",
  "9642": "squf;",
  "9643": "EmptyVerySmallSquare;",
  "9645": "rect;",
  "9646": "marker;",
  "9649": "fltns;",
  "9651": "xutri;",
  "9652": "utrif;",
  "9653": "utri;",
  "9656": "rtrif;",
  "9657": "triangleright;",
  "9661": "xdtri;",
  "9662": "dtrif;",
  "9663": "triangledown;",
  "9666": "ltrif;",
  "9667": "triangleleft;",
  "9674": "lozenge;",
  "9675": "cir;",
  "9708": "tridot;",
  "9711": "xcirc;",
  "9720": "ultri;",
  "9721": "urtri;",
  "9722": "lltri;",
  "9723": "EmptySmallSquare;",
  "9724": "FilledSmallSquare;",
  "9733": "starf;",
  "9734": "star;",
  "9742": "phone;",
  "9792": "female;",
  "9794": "male;",
  "9824": "spadesuit;",
  "9827": "clubsuit;",
  "9829": "heartsuit;",
  "9830": "diams;",
  "9834": "sung;",
  "9837": "flat;",
  "9838": "natural;",
  "9839": "sharp;",
  "10003": "checkmark;",
  "10007": "cross;",
  "10016": "maltese;",
  "10038": "sext;",
  "10072": "VerticalSeparator;",
  "10098": "lbbrk;",
  "10099": "rbbrk;",
  "10184": "bsolhsub;",
  "10185": "suphsol;",
  "10214": "lobrk;",
  "10215": "robrk;",
  "10216": "LeftAngleBracket;",
  "10217": "RightAngleBracket;",
  "10218": "Lang;",
  "10219": "Rang;",
  "10220": "loang;",
  "10221": "roang;",
  "10229": "xlarr;",
  "10230": "xrarr;",
  "10231": "xharr;",
  "10232": "xlArr;",
  "10233": "xrArr;",
  "10234": "xhArr;",
  "10236": "xmap;",
  "10239": "dzigrarr;",
  "10498": "nvlArr;",
  "10499": "nvrArr;",
  "10500": "nvHarr;",
  "10501": "Map;",
  "10508": "lbarr;",
  "10509": "rbarr;",
  "10510": "lBarr;",
  "10511": "rBarr;",
  "10512": "RBarr;",
  "10513": "DDotrahd;",
  "10514": "UpArrowBar;",
  "10515": "DownArrowBar;",
  "10518": "Rarrtl;",
  "10521": "latail;",
  "10522": "ratail;",
  "10523": "lAtail;",
  "10524": "rAtail;",
  "10525": "larrfs;",
  "10526": "rarrfs;",
  "10527": "larrbfs;",
  "10528": "rarrbfs;",
  "10531": "nwarhk;",
  "10532": "nearhk;",
  "10533": "searhk;",
  "10534": "swarhk;",
  "10535": "nwnear;",
  "10536": "toea;",
  "10537": "tosa;",
  "10538": "swnwar;",
  "10547": "rarrc;",
  "10549": "cudarrr;",
  "10550": "ldca;",
  "10551": "rdca;",
  "10552": "cudarrl;",
  "10553": "larrpl;",
  "10556": "curarrm;",
  "10557": "cularrp;",
  "10565": "rarrpl;",
  "10568": "harrcir;",
  "10569": "Uarrocir;",
  "10570": "lurdshar;",
  "10571": "ldrushar;",
  "10574": "LeftRightVector;",
  "10575": "RightUpDownVector;",
  "10576": "DownLeftRightVector;",
  "10577": "LeftUpDownVector;",
  "10578": "LeftVectorBar;",
  "10579": "RightVectorBar;",
  "10580": "RightUpVectorBar;",
  "10581": "RightDownVectorBar;",
  "10582": "DownLeftVectorBar;",
  "10583": "DownRightVectorBar;",
  "10584": "LeftUpVectorBar;",
  "10585": "LeftDownVectorBar;",
  "10586": "LeftTeeVector;",
  "10587": "RightTeeVector;",
  "10588": "RightUpTeeVector;",
  "10589": "RightDownTeeVector;",
  "10590": "DownLeftTeeVector;",
  "10591": "DownRightTeeVector;",
  "10592": "LeftUpTeeVector;",
  "10593": "LeftDownTeeVector;",
  "10594": "lHar;",
  "10595": "uHar;",
  "10596": "rHar;",
  "10597": "dHar;",
  "10598": "luruhar;",
  "10599": "ldrdhar;",
  "10600": "ruluhar;",
  "10601": "rdldhar;",
  "10602": "lharul;",
  "10603": "llhard;",
  "10604": "rharul;",
  "10605": "lrhard;",
  "10606": "UpEquilibrium;",
  "10607": "ReverseUpEquilibrium;",
  "10608": "RoundImplies;",
  "10609": "erarr;",
  "10610": "simrarr;",
  "10611": "larrsim;",
  "10612": "rarrsim;",
  "10613": "rarrap;",
  "10614": "ltlarr;",
  "10616": "gtrarr;",
  "10617": "subrarr;",
  "10619": "suplarr;",
  "10620": "lfisht;",
  "10621": "rfisht;",
  "10622": "ufisht;",
  "10623": "dfisht;",
  "10629": "lopar;",
  "10630": "ropar;",
  "10635": "lbrke;",
  "10636": "rbrke;",
  "10637": "lbrkslu;",
  "10638": "rbrksld;",
  "10639": "lbrksld;",
  "10640": "rbrkslu;",
  "10641": "langd;",
  "10642": "rangd;",
  "10643": "lparlt;",
  "10644": "rpargt;",
  "10645": "gtlPar;",
  "10646": "ltrPar;",
  "10650": "vzigzag;",
  "10652": "vangrt;",
  "10653": "angrtvbd;",
  "10660": "ange;",
  "10661": "range;",
  "10662": "dwangle;",
  "10663": "uwangle;",
  "10664": "angmsdaa;",
  "10665": "angmsdab;",
  "10666": "angmsdac;",
  "10667": "angmsdad;",
  "10668": "angmsdae;",
  "10669": "angmsdaf;",
  "10670": "angmsdag;",
  "10671": "angmsdah;",
  "10672": "bemptyv;",
  "10673": "demptyv;",
  "10674": "cemptyv;",
  "10675": "raemptyv;",
  "10676": "laemptyv;",
  "10677": "ohbar;",
  "10678": "omid;",
  "10679": "opar;",
  "10681": "operp;",
  "10683": "olcross;",
  "10684": "odsold;",
  "10686": "olcir;",
  "10687": "ofcir;",
  "10688": "olt;",
  "10689": "ogt;",
  "10690": "cirscir;",
  "10691": "cirE;",
  "10692": "solb;",
  "10693": "bsolb;",
  "10697": "boxbox;",
  "10701": "trisb;",
  "10702": "rtriltri;",
  "10703": "LeftTriangleBar;",
  "10704": "RightTriangleBar;",
  "10716": "iinfin;",
  "10717": "infintie;",
  "10718": "nvinfin;",
  "10723": "eparsl;",
  "10724": "smeparsl;",
  "10725": "eqvparsl;",
  "10731": "lozf;",
  "10740": "RuleDelayed;",
  "10742": "dsol;",
  "10752": "xodot;",
  "10753": "xoplus;",
  "10754": "xotime;",
  "10756": "xuplus;",
  "10758": "xsqcup;",
  "10764": "qint;",
  "10765": "fpartint;",
  "10768": "cirfnint;",
  "10769": "awint;",
  "10770": "rppolint;",
  "10771": "scpolint;",
  "10772": "npolint;",
  "10773": "pointint;",
  "10774": "quatint;",
  "10775": "intlarhk;",
  "10786": "pluscir;",
  "10787": "plusacir;",
  "10788": "simplus;",
  "10789": "plusdu;",
  "10790": "plussim;",
  "10791": "plustwo;",
  "10793": "mcomma;",
  "10794": "minusdu;",
  "10797": "loplus;",
  "10798": "roplus;",
  "10799": "Cross;",
  "10800": "timesd;",
  "10801": "timesbar;",
  "10803": "smashp;",
  "10804": "lotimes;",
  "10805": "rotimes;",
  "10806": "otimesas;",
  "10807": "Otimes;",
  "10808": "odiv;",
  "10809": "triplus;",
  "10810": "triminus;",
  "10811": "tritime;",
  "10812": "iprod;",
  "10815": "amalg;",
  "10816": "capdot;",
  "10818": "ncup;",
  "10819": "ncap;",
  "10820": "capand;",
  "10821": "cupor;",
  "10822": "cupcap;",
  "10823": "capcup;",
  "10824": "cupbrcap;",
  "10825": "capbrcup;",
  "10826": "cupcup;",
  "10827": "capcap;",
  "10828": "ccups;",
  "10829": "ccaps;",
  "10832": "ccupssm;",
  "10835": "And;",
  "10836": "Or;",
  "10837": "andand;",
  "10838": "oror;",
  "10839": "orslope;",
  "10840": "andslope;",
  "10842": "andv;",
  "10843": "orv;",
  "10844": "andd;",
  "10845": "ord;",
  "10847": "wedbar;",
  "10854": "sdote;",
  "10858": "simdot;",
  "10861": "congdot;",
  "10862": "easter;",
  "10863": "apacir;",
  "10864": "apE;",
  "10865": "eplus;",
  "10866": "pluse;",
  "10867": "Esim;",
  "10868": "Colone;",
  "10869": "Equal;",
  "10871": "eDDot;",
  "10872": "equivDD;",
  "10873": "ltcir;",
  "10874": "gtcir;",
  "10875": "ltquest;",
  "10876": "gtquest;",
  "10877": "LessSlantEqual;",
  "10878": "GreaterSlantEqual;",
  "10879": "lesdot;",
  "10880": "gesdot;",
  "10881": "lesdoto;",
  "10882": "gesdoto;",
  "10883": "lesdotor;",
  "10884": "gesdotol;",
  "10885": "lessapprox;",
  "10886": "gtrapprox;",
  "10887": "lneq;",
  "10888": "gneq;",
  "10889": "lnapprox;",
  "10890": "gnapprox;",
  "10891": "lesseqqgtr;",
  "10892": "gtreqqless;",
  "10893": "lsime;",
  "10894": "gsime;",
  "10895": "lsimg;",
  "10896": "gsiml;",
  "10897": "lgE;",
  "10898": "glE;",
  "10899": "lesges;",
  "10900": "gesles;",
  "10901": "eqslantless;",
  "10902": "eqslantgtr;",
  "10903": "elsdot;",
  "10904": "egsdot;",
  "10905": "el;",
  "10906": "eg;",
  "10909": "siml;",
  "10910": "simg;",
  "10911": "simlE;",
  "10912": "simgE;",
  "10913": "LessLess;",
  "10914": "GreaterGreater;",
  "10916": "glj;",
  "10917": "gla;",
  "10918": "ltcc;",
  "10919": "gtcc;",
  "10920": "lescc;",
  "10921": "gescc;",
  "10922": "smt;",
  "10923": "lat;",
  "10924": "smte;",
  "10925": "late;",
  "10926": "bumpE;",
  "10927": "preceq;",
  "10928": "succeq;",
  "10931": "prE;",
  "10932": "scE;",
  "10933": "prnE;",
  "10934": "succneqq;",
  "10935": "precapprox;",
  "10936": "succapprox;",
  "10937": "prnap;",
  "10938": "succnapprox;",
  "10939": "Pr;",
  "10940": "Sc;",
  "10941": "subdot;",
  "10942": "supdot;",
  "10943": "subplus;",
  "10944": "supplus;",
  "10945": "submult;",
  "10946": "supmult;",
  "10947": "subedot;",
  "10948": "supedot;",
  "10949": "subseteqq;",
  "10950": "supseteqq;",
  "10951": "subsim;",
  "10952": "supsim;",
  "10955": "subsetneqq;",
  "10956": "supsetneqq;",
  "10959": "csub;",
  "10960": "csup;",
  "10961": "csube;",
  "10962": "csupe;",
  "10963": "subsup;",
  "10964": "supsub;",
  "10965": "subsub;",
  "10966": "supsup;",
  "10967": "suphsub;",
  "10968": "supdsub;",
  "10969": "forkv;",
  "10970": "topfork;",
  "10971": "mlcp;",
  "10980": "DoubleLeftTee;",
  "10982": "Vdashl;",
  "10983": "Barv;",
  "10984": "vBar;",
  "10985": "vBarv;",
  "10987": "Vbar;",
  "10988": "Not;",
  "10989": "bNot;",
  "10990": "rnmid;",
  "10991": "cirmid;",
  "10992": "midcir;",
  "10993": "topcir;",
  "10994": "nhpar;",
  "10995": "parsim;",
  "11005": "parsl;",
  "64256": "fflig;",
  "64257": "filig;",
  "64258": "fllig;",
  "64259": "ffilig;",
  "64260": "ffllig;"
};
var punycode$1 = punycode$2.exports;
var $decode = punycode$1.ucs2.decode;
var $encode$1 = punycode$1.ucs2.encode;
var $TypeError$1 = type;
var regexTest$1 = safeRegexTest;
var revEntities = require$$3$1;
var endsInSemicolon$1 = regexTest$1(/;$/);
var defaultSpecial = {
  '"': true,
  "'": true,
  "<": true,
  ">": true,
  "&": true
};
var encode$1 = function encode(str, opts) {
  if (typeof str !== "string") {
    throw new $TypeError$1("Expected a String");
  }
  var numeric = !opts || !opts.named;
  if (opts && typeof opts.numeric !== "undefined") {
    numeric = opts.numeric;
  }
  var special = opts && opts.special || defaultSpecial;
  var codePoints = $decode(str);
  var chars = [];
  for (var i2 = 0; i2 < codePoints.length; i2++) {
    var cc = codePoints[i2];
    var c = $encode$1([cc]);
    var e = revEntities[cc];
    if (e && (cc >= 127 || special[c]) && !numeric) {
      var hasSemi = endsInSemicolon$1(e);
      chars[chars.length] = "&" + (hasSemi ? e : e + ";");
    } else if (cc < 32 || cc >= 127 || special[c]) {
      chars[chars.length] = "&#" + cc + ";";
    } else {
      chars[chars.length] = c;
    }
  }
  return chars.join("");
};
const Aacute$4 = "\xC1";
const aacute$4 = "\xE1";
const Acirc$4 = "\xC2";
const acirc$4 = "\xE2";
const acute$4 = "\xB4";
const AElig$4 = "\xC6";
const aelig$4 = "\xE6";
const Agrave$4 = "\xC0";
const agrave$4 = "\xE0";
const AMP$4 = "&";
const amp$6 = "&";
const Aring$4 = "\xC5";
const aring$4 = "\xE5";
const Atilde$4 = "\xC3";
const atilde$4 = "\xE3";
const Auml$4 = "\xC4";
const auml$4 = "\xE4";
const brvbar$4 = "\xA6";
const Ccedil$4 = "\xC7";
const ccedil$4 = "\xE7";
const cedil$4 = "\xB8";
const cent$4 = "\xA2";
const COPY$4 = "\xA9";
const copy$4 = "\xA9";
const curren$4 = "\xA4";
const deg$4 = "\xB0";
const divide$4 = "\xF7";
const Eacute$4 = "\xC9";
const eacute$4 = "\xE9";
const Ecirc$4 = "\xCA";
const ecirc$4 = "\xEA";
const Egrave$4 = "\xC8";
const egrave$4 = "\xE8";
const ETH$4 = "\xD0";
const eth$4 = "\xF0";
const Euml$4 = "\xCB";
const euml$4 = "\xEB";
const frac12$4 = "\xBD";
const frac14$4 = "\xBC";
const frac34$4 = "\xBE";
const GT$4 = ">";
const gt$6 = ">";
const Iacute$4 = "\xCD";
const iacute$4 = "\xED";
const Icirc$4 = "\xCE";
const icirc$4 = "\xEE";
const iexcl$4 = "\xA1";
const Igrave$4 = "\xCC";
const igrave$4 = "\xEC";
const iquest$4 = "\xBF";
const Iuml$4 = "\xCF";
const iuml$4 = "\xEF";
const laquo$4 = "\xAB";
const LT$4 = "<";
const lt$6 = "<";
const macr$4 = "\xAF";
const micro$4 = "\xB5";
const middot$4 = "\xB7";
const nbsp$4 = "\xA0";
const not$4 = "\xAC";
const Ntilde$4 = "\xD1";
const ntilde$4 = "\xF1";
const Oacute$4 = "\xD3";
const oacute$4 = "\xF3";
const Ocirc$4 = "\xD4";
const ocirc$4 = "\xF4";
const Ograve$4 = "\xD2";
const ograve$4 = "\xF2";
const ordf$4 = "\xAA";
const ordm$4 = "\xBA";
const Oslash$4 = "\xD8";
const oslash$4 = "\xF8";
const Otilde$4 = "\xD5";
const otilde$4 = "\xF5";
const Ouml$4 = "\xD6";
const ouml$4 = "\xF6";
const para$4 = "\xB6";
const plusmn$4 = "\xB1";
const pound$4 = "\xA3";
const QUOT$4 = '"';
const quot$6 = '"';
const raquo$4 = "\xBB";
const REG$4 = "\xAE";
const reg$4 = "\xAE";
const sect$4 = "\xA7";
const shy$4 = "\xAD";
const sup1$4 = "\xB9";
const sup2$4 = "\xB2";
const sup3$4 = "\xB3";
const szlig$4 = "\xDF";
const THORN$4 = "\xDE";
const thorn$4 = "\xFE";
const times$4 = "\xD7";
const Uacute$4 = "\xDA";
const uacute$4 = "\xFA";
const Ucirc$4 = "\xDB";
const ucirc$4 = "\xFB";
const Ugrave$4 = "\xD9";
const ugrave$4 = "\xF9";
const uml$4 = "\xA8";
const Uuml$4 = "\xDC";
const uuml$4 = "\xFC";
const Yacute$4 = "\xDD";
const yacute$4 = "\xFD";
const yen$4 = "\xA5";
const yuml$4 = "\xFF";
const require$$4 = {
  "Aacute;": "\xC1",
  Aacute: Aacute$4,
  "aacute;": "\xE1",
  aacute: aacute$4,
  "Abreve;": "\u0102",
  "abreve;": "\u0103",
  "ac;": "\u223E",
  "acd;": "\u223F",
  "acE;": "\u223E\u0333",
  "Acirc;": "\xC2",
  Acirc: Acirc$4,
  "acirc;": "\xE2",
  acirc: acirc$4,
  "acute;": "\xB4",
  acute: acute$4,
  "Acy;": "\u0410",
  "acy;": "\u0430",
  "AElig;": "\xC6",
  AElig: AElig$4,
  "aelig;": "\xE6",
  aelig: aelig$4,
  "af;": "\u2061",
  "Afr;": "\u{1D504}",
  "afr;": "\u{1D51E}",
  "Agrave;": "\xC0",
  Agrave: Agrave$4,
  "agrave;": "\xE0",
  agrave: agrave$4,
  "alefsym;": "\u2135",
  "aleph;": "\u2135",
  "Alpha;": "\u0391",
  "alpha;": "\u03B1",
  "Amacr;": "\u0100",
  "amacr;": "\u0101",
  "amalg;": "\u2A3F",
  "AMP;": "&",
  AMP: AMP$4,
  "amp;": "&",
  amp: amp$6,
  "And;": "\u2A53",
  "and;": "\u2227",
  "andand;": "\u2A55",
  "andd;": "\u2A5C",
  "andslope;": "\u2A58",
  "andv;": "\u2A5A",
  "ang;": "\u2220",
  "ange;": "\u29A4",
  "angle;": "\u2220",
  "angmsd;": "\u2221",
  "angmsdaa;": "\u29A8",
  "angmsdab;": "\u29A9",
  "angmsdac;": "\u29AA",
  "angmsdad;": "\u29AB",
  "angmsdae;": "\u29AC",
  "angmsdaf;": "\u29AD",
  "angmsdag;": "\u29AE",
  "angmsdah;": "\u29AF",
  "angrt;": "\u221F",
  "angrtvb;": "\u22BE",
  "angrtvbd;": "\u299D",
  "angsph;": "\u2222",
  "angst;": "\xC5",
  "angzarr;": "\u237C",
  "Aogon;": "\u0104",
  "aogon;": "\u0105",
  "Aopf;": "\u{1D538}",
  "aopf;": "\u{1D552}",
  "ap;": "\u2248",
  "apacir;": "\u2A6F",
  "apE;": "\u2A70",
  "ape;": "\u224A",
  "apid;": "\u224B",
  "apos;": "'",
  "ApplyFunction;": "\u2061",
  "approx;": "\u2248",
  "approxeq;": "\u224A",
  "Aring;": "\xC5",
  Aring: Aring$4,
  "aring;": "\xE5",
  aring: aring$4,
  "Ascr;": "\u{1D49C}",
  "ascr;": "\u{1D4B6}",
  "Assign;": "\u2254",
  "ast;": "*",
  "asymp;": "\u2248",
  "asympeq;": "\u224D",
  "Atilde;": "\xC3",
  Atilde: Atilde$4,
  "atilde;": "\xE3",
  atilde: atilde$4,
  "Auml;": "\xC4",
  Auml: Auml$4,
  "auml;": "\xE4",
  auml: auml$4,
  "awconint;": "\u2233",
  "awint;": "\u2A11",
  "backcong;": "\u224C",
  "backepsilon;": "\u03F6",
  "backprime;": "\u2035",
  "backsim;": "\u223D",
  "backsimeq;": "\u22CD",
  "Backslash;": "\u2216",
  "Barv;": "\u2AE7",
  "barvee;": "\u22BD",
  "Barwed;": "\u2306",
  "barwed;": "\u2305",
  "barwedge;": "\u2305",
  "bbrk;": "\u23B5",
  "bbrktbrk;": "\u23B6",
  "bcong;": "\u224C",
  "Bcy;": "\u0411",
  "bcy;": "\u0431",
  "bdquo;": "\u201E",
  "becaus;": "\u2235",
  "Because;": "\u2235",
  "because;": "\u2235",
  "bemptyv;": "\u29B0",
  "bepsi;": "\u03F6",
  "bernou;": "\u212C",
  "Bernoullis;": "\u212C",
  "Beta;": "\u0392",
  "beta;": "\u03B2",
  "beth;": "\u2136",
  "between;": "\u226C",
  "Bfr;": "\u{1D505}",
  "bfr;": "\u{1D51F}",
  "bigcap;": "\u22C2",
  "bigcirc;": "\u25EF",
  "bigcup;": "\u22C3",
  "bigodot;": "\u2A00",
  "bigoplus;": "\u2A01",
  "bigotimes;": "\u2A02",
  "bigsqcup;": "\u2A06",
  "bigstar;": "\u2605",
  "bigtriangledown;": "\u25BD",
  "bigtriangleup;": "\u25B3",
  "biguplus;": "\u2A04",
  "bigvee;": "\u22C1",
  "bigwedge;": "\u22C0",
  "bkarow;": "\u290D",
  "blacklozenge;": "\u29EB",
  "blacksquare;": "\u25AA",
  "blacktriangle;": "\u25B4",
  "blacktriangledown;": "\u25BE",
  "blacktriangleleft;": "\u25C2",
  "blacktriangleright;": "\u25B8",
  "blank;": "\u2423",
  "blk12;": "\u2592",
  "blk14;": "\u2591",
  "blk34;": "\u2593",
  "block;": "\u2588",
  "bne;": "=\u20E5",
  "bnequiv;": "\u2261\u20E5",
  "bNot;": "\u2AED",
  "bnot;": "\u2310",
  "Bopf;": "\u{1D539}",
  "bopf;": "\u{1D553}",
  "bot;": "\u22A5",
  "bottom;": "\u22A5",
  "bowtie;": "\u22C8",
  "boxbox;": "\u29C9",
  "boxDL;": "\u2557",
  "boxDl;": "\u2556",
  "boxdL;": "\u2555",
  "boxdl;": "\u2510",
  "boxDR;": "\u2554",
  "boxDr;": "\u2553",
  "boxdR;": "\u2552",
  "boxdr;": "\u250C",
  "boxH;": "\u2550",
  "boxh;": "\u2500",
  "boxHD;": "\u2566",
  "boxHd;": "\u2564",
  "boxhD;": "\u2565",
  "boxhd;": "\u252C",
  "boxHU;": "\u2569",
  "boxHu;": "\u2567",
  "boxhU;": "\u2568",
  "boxhu;": "\u2534",
  "boxminus;": "\u229F",
  "boxplus;": "\u229E",
  "boxtimes;": "\u22A0",
  "boxUL;": "\u255D",
  "boxUl;": "\u255C",
  "boxuL;": "\u255B",
  "boxul;": "\u2518",
  "boxUR;": "\u255A",
  "boxUr;": "\u2559",
  "boxuR;": "\u2558",
  "boxur;": "\u2514",
  "boxV;": "\u2551",
  "boxv;": "\u2502",
  "boxVH;": "\u256C",
  "boxVh;": "\u256B",
  "boxvH;": "\u256A",
  "boxvh;": "\u253C",
  "boxVL;": "\u2563",
  "boxVl;": "\u2562",
  "boxvL;": "\u2561",
  "boxvl;": "\u2524",
  "boxVR;": "\u2560",
  "boxVr;": "\u255F",
  "boxvR;": "\u255E",
  "boxvr;": "\u251C",
  "bprime;": "\u2035",
  "Breve;": "\u02D8",
  "breve;": "\u02D8",
  "brvbar;": "\xA6",
  brvbar: brvbar$4,
  "Bscr;": "\u212C",
  "bscr;": "\u{1D4B7}",
  "bsemi;": "\u204F",
  "bsim;": "\u223D",
  "bsime;": "\u22CD",
  "bsol;": "\\",
  "bsolb;": "\u29C5",
  "bsolhsub;": "\u27C8",
  "bull;": "\u2022",
  "bullet;": "\u2022",
  "bump;": "\u224E",
  "bumpE;": "\u2AAE",
  "bumpe;": "\u224F",
  "Bumpeq;": "\u224E",
  "bumpeq;": "\u224F",
  "Cacute;": "\u0106",
  "cacute;": "\u0107",
  "Cap;": "\u22D2",
  "cap;": "\u2229",
  "capand;": "\u2A44",
  "capbrcup;": "\u2A49",
  "capcap;": "\u2A4B",
  "capcup;": "\u2A47",
  "capdot;": "\u2A40",
  "CapitalDifferentialD;": "\u2145",
  "caps;": "\u2229\uFE00",
  "caret;": "\u2041",
  "caron;": "\u02C7",
  "Cayleys;": "\u212D",
  "ccaps;": "\u2A4D",
  "Ccaron;": "\u010C",
  "ccaron;": "\u010D",
  "Ccedil;": "\xC7",
  Ccedil: Ccedil$4,
  "ccedil;": "\xE7",
  ccedil: ccedil$4,
  "Ccirc;": "\u0108",
  "ccirc;": "\u0109",
  "Cconint;": "\u2230",
  "ccups;": "\u2A4C",
  "ccupssm;": "\u2A50",
  "Cdot;": "\u010A",
  "cdot;": "\u010B",
  "cedil;": "\xB8",
  cedil: cedil$4,
  "Cedilla;": "\xB8",
  "cemptyv;": "\u29B2",
  "cent;": "\xA2",
  cent: cent$4,
  "CenterDot;": "\xB7",
  "centerdot;": "\xB7",
  "Cfr;": "\u212D",
  "cfr;": "\u{1D520}",
  "CHcy;": "\u0427",
  "chcy;": "\u0447",
  "check;": "\u2713",
  "checkmark;": "\u2713",
  "Chi;": "\u03A7",
  "chi;": "\u03C7",
  "cir;": "\u25CB",
  "circ;": "\u02C6",
  "circeq;": "\u2257",
  "circlearrowleft;": "\u21BA",
  "circlearrowright;": "\u21BB",
  "circledast;": "\u229B",
  "circledcirc;": "\u229A",
  "circleddash;": "\u229D",
  "CircleDot;": "\u2299",
  "circledR;": "\xAE",
  "circledS;": "\u24C8",
  "CircleMinus;": "\u2296",
  "CirclePlus;": "\u2295",
  "CircleTimes;": "\u2297",
  "cirE;": "\u29C3",
  "cire;": "\u2257",
  "cirfnint;": "\u2A10",
  "cirmid;": "\u2AEF",
  "cirscir;": "\u29C2",
  "ClockwiseContourIntegral;": "\u2232",
  "CloseCurlyDoubleQuote;": "\u201D",
  "CloseCurlyQuote;": "\u2019",
  "clubs;": "\u2663",
  "clubsuit;": "\u2663",
  "Colon;": "\u2237",
  "colon;": ":",
  "Colone;": "\u2A74",
  "colone;": "\u2254",
  "coloneq;": "\u2254",
  "comma;": ",",
  "commat;": "@",
  "comp;": "\u2201",
  "compfn;": "\u2218",
  "complement;": "\u2201",
  "complexes;": "\u2102",
  "cong;": "\u2245",
  "congdot;": "\u2A6D",
  "Congruent;": "\u2261",
  "Conint;": "\u222F",
  "conint;": "\u222E",
  "ContourIntegral;": "\u222E",
  "Copf;": "\u2102",
  "copf;": "\u{1D554}",
  "coprod;": "\u2210",
  "Coproduct;": "\u2210",
  "COPY;": "\xA9",
  COPY: COPY$4,
  "copy;": "\xA9",
  copy: copy$4,
  "copysr;": "\u2117",
  "CounterClockwiseContourIntegral;": "\u2233",
  "crarr;": "\u21B5",
  "Cross;": "\u2A2F",
  "cross;": "\u2717",
  "Cscr;": "\u{1D49E}",
  "cscr;": "\u{1D4B8}",
  "csub;": "\u2ACF",
  "csube;": "\u2AD1",
  "csup;": "\u2AD0",
  "csupe;": "\u2AD2",
  "ctdot;": "\u22EF",
  "cudarrl;": "\u2938",
  "cudarrr;": "\u2935",
  "cuepr;": "\u22DE",
  "cuesc;": "\u22DF",
  "cularr;": "\u21B6",
  "cularrp;": "\u293D",
  "Cup;": "\u22D3",
  "cup;": "\u222A",
  "cupbrcap;": "\u2A48",
  "CupCap;": "\u224D",
  "cupcap;": "\u2A46",
  "cupcup;": "\u2A4A",
  "cupdot;": "\u228D",
  "cupor;": "\u2A45",
  "cups;": "\u222A\uFE00",
  "curarr;": "\u21B7",
  "curarrm;": "\u293C",
  "curlyeqprec;": "\u22DE",
  "curlyeqsucc;": "\u22DF",
  "curlyvee;": "\u22CE",
  "curlywedge;": "\u22CF",
  "curren;": "\xA4",
  curren: curren$4,
  "curvearrowleft;": "\u21B6",
  "curvearrowright;": "\u21B7",
  "cuvee;": "\u22CE",
  "cuwed;": "\u22CF",
  "cwconint;": "\u2232",
  "cwint;": "\u2231",
  "cylcty;": "\u232D",
  "Dagger;": "\u2021",
  "dagger;": "\u2020",
  "daleth;": "\u2138",
  "Darr;": "\u21A1",
  "dArr;": "\u21D3",
  "darr;": "\u2193",
  "dash;": "\u2010",
  "Dashv;": "\u2AE4",
  "dashv;": "\u22A3",
  "dbkarow;": "\u290F",
  "dblac;": "\u02DD",
  "Dcaron;": "\u010E",
  "dcaron;": "\u010F",
  "Dcy;": "\u0414",
  "dcy;": "\u0434",
  "DD;": "\u2145",
  "dd;": "\u2146",
  "ddagger;": "\u2021",
  "ddarr;": "\u21CA",
  "DDotrahd;": "\u2911",
  "ddotseq;": "\u2A77",
  "deg;": "\xB0",
  deg: deg$4,
  "Del;": "\u2207",
  "Delta;": "\u0394",
  "delta;": "\u03B4",
  "demptyv;": "\u29B1",
  "dfisht;": "\u297F",
  "Dfr;": "\u{1D507}",
  "dfr;": "\u{1D521}",
  "dHar;": "\u2965",
  "dharl;": "\u21C3",
  "dharr;": "\u21C2",
  "DiacriticalAcute;": "\xB4",
  "DiacriticalDot;": "\u02D9",
  "DiacriticalDoubleAcute;": "\u02DD",
  "DiacriticalGrave;": "`",
  "DiacriticalTilde;": "\u02DC",
  "diam;": "\u22C4",
  "Diamond;": "\u22C4",
  "diamond;": "\u22C4",
  "diamondsuit;": "\u2666",
  "diams;": "\u2666",
  "die;": "\xA8",
  "DifferentialD;": "\u2146",
  "digamma;": "\u03DD",
  "disin;": "\u22F2",
  "div;": "\xF7",
  "divide;": "\xF7",
  divide: divide$4,
  "divideontimes;": "\u22C7",
  "divonx;": "\u22C7",
  "DJcy;": "\u0402",
  "djcy;": "\u0452",
  "dlcorn;": "\u231E",
  "dlcrop;": "\u230D",
  "dollar;": "$",
  "Dopf;": "\u{1D53B}",
  "dopf;": "\u{1D555}",
  "Dot;": "\xA8",
  "dot;": "\u02D9",
  "DotDot;": "\u20DC",
  "doteq;": "\u2250",
  "doteqdot;": "\u2251",
  "DotEqual;": "\u2250",
  "dotminus;": "\u2238",
  "dotplus;": "\u2214",
  "dotsquare;": "\u22A1",
  "doublebarwedge;": "\u2306",
  "DoubleContourIntegral;": "\u222F",
  "DoubleDot;": "\xA8",
  "DoubleDownArrow;": "\u21D3",
  "DoubleLeftArrow;": "\u21D0",
  "DoubleLeftRightArrow;": "\u21D4",
  "DoubleLeftTee;": "\u2AE4",
  "DoubleLongLeftArrow;": "\u27F8",
  "DoubleLongLeftRightArrow;": "\u27FA",
  "DoubleLongRightArrow;": "\u27F9",
  "DoubleRightArrow;": "\u21D2",
  "DoubleRightTee;": "\u22A8",
  "DoubleUpArrow;": "\u21D1",
  "DoubleUpDownArrow;": "\u21D5",
  "DoubleVerticalBar;": "\u2225",
  "DownArrow;": "\u2193",
  "Downarrow;": "\u21D3",
  "downarrow;": "\u2193",
  "DownArrowBar;": "\u2913",
  "DownArrowUpArrow;": "\u21F5",
  "DownBreve;": "\u0311",
  "downdownarrows;": "\u21CA",
  "downharpoonleft;": "\u21C3",
  "downharpoonright;": "\u21C2",
  "DownLeftRightVector;": "\u2950",
  "DownLeftTeeVector;": "\u295E",
  "DownLeftVector;": "\u21BD",
  "DownLeftVectorBar;": "\u2956",
  "DownRightTeeVector;": "\u295F",
  "DownRightVector;": "\u21C1",
  "DownRightVectorBar;": "\u2957",
  "DownTee;": "\u22A4",
  "DownTeeArrow;": "\u21A7",
  "drbkarow;": "\u2910",
  "drcorn;": "\u231F",
  "drcrop;": "\u230C",
  "Dscr;": "\u{1D49F}",
  "dscr;": "\u{1D4B9}",
  "DScy;": "\u0405",
  "dscy;": "\u0455",
  "dsol;": "\u29F6",
  "Dstrok;": "\u0110",
  "dstrok;": "\u0111",
  "dtdot;": "\u22F1",
  "dtri;": "\u25BF",
  "dtrif;": "\u25BE",
  "duarr;": "\u21F5",
  "duhar;": "\u296F",
  "dwangle;": "\u29A6",
  "DZcy;": "\u040F",
  "dzcy;": "\u045F",
  "dzigrarr;": "\u27FF",
  "Eacute;": "\xC9",
  Eacute: Eacute$4,
  "eacute;": "\xE9",
  eacute: eacute$4,
  "easter;": "\u2A6E",
  "Ecaron;": "\u011A",
  "ecaron;": "\u011B",
  "ecir;": "\u2256",
  "Ecirc;": "\xCA",
  Ecirc: Ecirc$4,
  "ecirc;": "\xEA",
  ecirc: ecirc$4,
  "ecolon;": "\u2255",
  "Ecy;": "\u042D",
  "ecy;": "\u044D",
  "eDDot;": "\u2A77",
  "Edot;": "\u0116",
  "eDot;": "\u2251",
  "edot;": "\u0117",
  "ee;": "\u2147",
  "efDot;": "\u2252",
  "Efr;": "\u{1D508}",
  "efr;": "\u{1D522}",
  "eg;": "\u2A9A",
  "Egrave;": "\xC8",
  Egrave: Egrave$4,
  "egrave;": "\xE8",
  egrave: egrave$4,
  "egs;": "\u2A96",
  "egsdot;": "\u2A98",
  "el;": "\u2A99",
  "Element;": "\u2208",
  "elinters;": "\u23E7",
  "ell;": "\u2113",
  "els;": "\u2A95",
  "elsdot;": "\u2A97",
  "Emacr;": "\u0112",
  "emacr;": "\u0113",
  "empty;": "\u2205",
  "emptyset;": "\u2205",
  "EmptySmallSquare;": "\u25FB",
  "emptyv;": "\u2205",
  "EmptyVerySmallSquare;": "\u25AB",
  "emsp;": "\u2003",
  "emsp13;": "\u2004",
  "emsp14;": "\u2005",
  "ENG;": "\u014A",
  "eng;": "\u014B",
  "ensp;": "\u2002",
  "Eogon;": "\u0118",
  "eogon;": "\u0119",
  "Eopf;": "\u{1D53C}",
  "eopf;": "\u{1D556}",
  "epar;": "\u22D5",
  "eparsl;": "\u29E3",
  "eplus;": "\u2A71",
  "epsi;": "\u03B5",
  "Epsilon;": "\u0395",
  "epsilon;": "\u03B5",
  "epsiv;": "\u03F5",
  "eqcirc;": "\u2256",
  "eqcolon;": "\u2255",
  "eqsim;": "\u2242",
  "eqslantgtr;": "\u2A96",
  "eqslantless;": "\u2A95",
  "Equal;": "\u2A75",
  "equals;": "=",
  "EqualTilde;": "\u2242",
  "equest;": "\u225F",
  "Equilibrium;": "\u21CC",
  "equiv;": "\u2261",
  "equivDD;": "\u2A78",
  "eqvparsl;": "\u29E5",
  "erarr;": "\u2971",
  "erDot;": "\u2253",
  "Escr;": "\u2130",
  "escr;": "\u212F",
  "esdot;": "\u2250",
  "Esim;": "\u2A73",
  "esim;": "\u2242",
  "Eta;": "\u0397",
  "eta;": "\u03B7",
  "ETH;": "\xD0",
  ETH: ETH$4,
  "eth;": "\xF0",
  eth: eth$4,
  "Euml;": "\xCB",
  Euml: Euml$4,
  "euml;": "\xEB",
  euml: euml$4,
  "euro;": "\u20AC",
  "excl;": "!",
  "exist;": "\u2203",
  "Exists;": "\u2203",
  "expectation;": "\u2130",
  "ExponentialE;": "\u2147",
  "exponentiale;": "\u2147",
  "fallingdotseq;": "\u2252",
  "Fcy;": "\u0424",
  "fcy;": "\u0444",
  "female;": "\u2640",
  "ffilig;": "\uFB03",
  "fflig;": "\uFB00",
  "ffllig;": "\uFB04",
  "Ffr;": "\u{1D509}",
  "ffr;": "\u{1D523}",
  "filig;": "\uFB01",
  "FilledSmallSquare;": "\u25FC",
  "FilledVerySmallSquare;": "\u25AA",
  "fjlig;": "fj",
  "flat;": "\u266D",
  "fllig;": "\uFB02",
  "fltns;": "\u25B1",
  "fnof;": "\u0192",
  "Fopf;": "\u{1D53D}",
  "fopf;": "\u{1D557}",
  "ForAll;": "\u2200",
  "forall;": "\u2200",
  "fork;": "\u22D4",
  "forkv;": "\u2AD9",
  "Fouriertrf;": "\u2131",
  "fpartint;": "\u2A0D",
  "frac12;": "\xBD",
  frac12: frac12$4,
  "frac13;": "\u2153",
  "frac14;": "\xBC",
  frac14: frac14$4,
  "frac15;": "\u2155",
  "frac16;": "\u2159",
  "frac18;": "\u215B",
  "frac23;": "\u2154",
  "frac25;": "\u2156",
  "frac34;": "\xBE",
  frac34: frac34$4,
  "frac35;": "\u2157",
  "frac38;": "\u215C",
  "frac45;": "\u2158",
  "frac56;": "\u215A",
  "frac58;": "\u215D",
  "frac78;": "\u215E",
  "frasl;": "\u2044",
  "frown;": "\u2322",
  "Fscr;": "\u2131",
  "fscr;": "\u{1D4BB}",
  "gacute;": "\u01F5",
  "Gamma;": "\u0393",
  "gamma;": "\u03B3",
  "Gammad;": "\u03DC",
  "gammad;": "\u03DD",
  "gap;": "\u2A86",
  "Gbreve;": "\u011E",
  "gbreve;": "\u011F",
  "Gcedil;": "\u0122",
  "Gcirc;": "\u011C",
  "gcirc;": "\u011D",
  "Gcy;": "\u0413",
  "gcy;": "\u0433",
  "Gdot;": "\u0120",
  "gdot;": "\u0121",
  "gE;": "\u2267",
  "ge;": "\u2265",
  "gEl;": "\u2A8C",
  "gel;": "\u22DB",
  "geq;": "\u2265",
  "geqq;": "\u2267",
  "geqslant;": "\u2A7E",
  "ges;": "\u2A7E",
  "gescc;": "\u2AA9",
  "gesdot;": "\u2A80",
  "gesdoto;": "\u2A82",
  "gesdotol;": "\u2A84",
  "gesl;": "\u22DB\uFE00",
  "gesles;": "\u2A94",
  "Gfr;": "\u{1D50A}",
  "gfr;": "\u{1D524}",
  "Gg;": "\u22D9",
  "gg;": "\u226B",
  "ggg;": "\u22D9",
  "gimel;": "\u2137",
  "GJcy;": "\u0403",
  "gjcy;": "\u0453",
  "gl;": "\u2277",
  "gla;": "\u2AA5",
  "glE;": "\u2A92",
  "glj;": "\u2AA4",
  "gnap;": "\u2A8A",
  "gnapprox;": "\u2A8A",
  "gnE;": "\u2269",
  "gne;": "\u2A88",
  "gneq;": "\u2A88",
  "gneqq;": "\u2269",
  "gnsim;": "\u22E7",
  "Gopf;": "\u{1D53E}",
  "gopf;": "\u{1D558}",
  "grave;": "`",
  "GreaterEqual;": "\u2265",
  "GreaterEqualLess;": "\u22DB",
  "GreaterFullEqual;": "\u2267",
  "GreaterGreater;": "\u2AA2",
  "GreaterLess;": "\u2277",
  "GreaterSlantEqual;": "\u2A7E",
  "GreaterTilde;": "\u2273",
  "Gscr;": "\u{1D4A2}",
  "gscr;": "\u210A",
  "gsim;": "\u2273",
  "gsime;": "\u2A8E",
  "gsiml;": "\u2A90",
  "GT;": ">",
  GT: GT$4,
  "Gt;": "\u226B",
  "gt;": ">",
  gt: gt$6,
  "gtcc;": "\u2AA7",
  "gtcir;": "\u2A7A",
  "gtdot;": "\u22D7",
  "gtlPar;": "\u2995",
  "gtquest;": "\u2A7C",
  "gtrapprox;": "\u2A86",
  "gtrarr;": "\u2978",
  "gtrdot;": "\u22D7",
  "gtreqless;": "\u22DB",
  "gtreqqless;": "\u2A8C",
  "gtrless;": "\u2277",
  "gtrsim;": "\u2273",
  "gvertneqq;": "\u2269\uFE00",
  "gvnE;": "\u2269\uFE00",
  "Hacek;": "\u02C7",
  "hairsp;": "\u200A",
  "half;": "\xBD",
  "hamilt;": "\u210B",
  "HARDcy;": "\u042A",
  "hardcy;": "\u044A",
  "hArr;": "\u21D4",
  "harr;": "\u2194",
  "harrcir;": "\u2948",
  "harrw;": "\u21AD",
  "Hat;": "^",
  "hbar;": "\u210F",
  "Hcirc;": "\u0124",
  "hcirc;": "\u0125",
  "hearts;": "\u2665",
  "heartsuit;": "\u2665",
  "hellip;": "\u2026",
  "hercon;": "\u22B9",
  "Hfr;": "\u210C",
  "hfr;": "\u{1D525}",
  "HilbertSpace;": "\u210B",
  "hksearow;": "\u2925",
  "hkswarow;": "\u2926",
  "hoarr;": "\u21FF",
  "homtht;": "\u223B",
  "hookleftarrow;": "\u21A9",
  "hookrightarrow;": "\u21AA",
  "Hopf;": "\u210D",
  "hopf;": "\u{1D559}",
  "horbar;": "\u2015",
  "HorizontalLine;": "\u2500",
  "Hscr;": "\u210B",
  "hscr;": "\u{1D4BD}",
  "hslash;": "\u210F",
  "Hstrok;": "\u0126",
  "hstrok;": "\u0127",
  "HumpDownHump;": "\u224E",
  "HumpEqual;": "\u224F",
  "hybull;": "\u2043",
  "hyphen;": "\u2010",
  "Iacute;": "\xCD",
  Iacute: Iacute$4,
  "iacute;": "\xED",
  iacute: iacute$4,
  "ic;": "\u2063",
  "Icirc;": "\xCE",
  Icirc: Icirc$4,
  "icirc;": "\xEE",
  icirc: icirc$4,
  "Icy;": "\u0418",
  "icy;": "\u0438",
  "Idot;": "\u0130",
  "IEcy;": "\u0415",
  "iecy;": "\u0435",
  "iexcl;": "\xA1",
  iexcl: iexcl$4,
  "iff;": "\u21D4",
  "Ifr;": "\u2111",
  "ifr;": "\u{1D526}",
  "Igrave;": "\xCC",
  Igrave: Igrave$4,
  "igrave;": "\xEC",
  igrave: igrave$4,
  "ii;": "\u2148",
  "iiiint;": "\u2A0C",
  "iiint;": "\u222D",
  "iinfin;": "\u29DC",
  "iiota;": "\u2129",
  "IJlig;": "\u0132",
  "ijlig;": "\u0133",
  "Im;": "\u2111",
  "Imacr;": "\u012A",
  "imacr;": "\u012B",
  "image;": "\u2111",
  "ImaginaryI;": "\u2148",
  "imagline;": "\u2110",
  "imagpart;": "\u2111",
  "imath;": "\u0131",
  "imof;": "\u22B7",
  "imped;": "\u01B5",
  "Implies;": "\u21D2",
  "in;": "\u2208",
  "incare;": "\u2105",
  "infin;": "\u221E",
  "infintie;": "\u29DD",
  "inodot;": "\u0131",
  "Int;": "\u222C",
  "int;": "\u222B",
  "intcal;": "\u22BA",
  "integers;": "\u2124",
  "Integral;": "\u222B",
  "intercal;": "\u22BA",
  "Intersection;": "\u22C2",
  "intlarhk;": "\u2A17",
  "intprod;": "\u2A3C",
  "InvisibleComma;": "\u2063",
  "InvisibleTimes;": "\u2062",
  "IOcy;": "\u0401",
  "iocy;": "\u0451",
  "Iogon;": "\u012E",
  "iogon;": "\u012F",
  "Iopf;": "\u{1D540}",
  "iopf;": "\u{1D55A}",
  "Iota;": "\u0399",
  "iota;": "\u03B9",
  "iprod;": "\u2A3C",
  "iquest;": "\xBF",
  iquest: iquest$4,
  "Iscr;": "\u2110",
  "iscr;": "\u{1D4BE}",
  "isin;": "\u2208",
  "isindot;": "\u22F5",
  "isinE;": "\u22F9",
  "isins;": "\u22F4",
  "isinsv;": "\u22F3",
  "isinv;": "\u2208",
  "it;": "\u2062",
  "Itilde;": "\u0128",
  "itilde;": "\u0129",
  "Iukcy;": "\u0406",
  "iukcy;": "\u0456",
  "Iuml;": "\xCF",
  Iuml: Iuml$4,
  "iuml;": "\xEF",
  iuml: iuml$4,
  "Jcirc;": "\u0134",
  "jcirc;": "\u0135",
  "Jcy;": "\u0419",
  "jcy;": "\u0439",
  "Jfr;": "\u{1D50D}",
  "jfr;": "\u{1D527}",
  "jmath;": "\u0237",
  "Jopf;": "\u{1D541}",
  "jopf;": "\u{1D55B}",
  "Jscr;": "\u{1D4A5}",
  "jscr;": "\u{1D4BF}",
  "Jsercy;": "\u0408",
  "jsercy;": "\u0458",
  "Jukcy;": "\u0404",
  "jukcy;": "\u0454",
  "Kappa;": "\u039A",
  "kappa;": "\u03BA",
  "kappav;": "\u03F0",
  "Kcedil;": "\u0136",
  "kcedil;": "\u0137",
  "Kcy;": "\u041A",
  "kcy;": "\u043A",
  "Kfr;": "\u{1D50E}",
  "kfr;": "\u{1D528}",
  "kgreen;": "\u0138",
  "KHcy;": "\u0425",
  "khcy;": "\u0445",
  "KJcy;": "\u040C",
  "kjcy;": "\u045C",
  "Kopf;": "\u{1D542}",
  "kopf;": "\u{1D55C}",
  "Kscr;": "\u{1D4A6}",
  "kscr;": "\u{1D4C0}",
  "lAarr;": "\u21DA",
  "Lacute;": "\u0139",
  "lacute;": "\u013A",
  "laemptyv;": "\u29B4",
  "lagran;": "\u2112",
  "Lambda;": "\u039B",
  "lambda;": "\u03BB",
  "Lang;": "\u27EA",
  "lang;": "\u27E8",
  "langd;": "\u2991",
  "langle;": "\u27E8",
  "lap;": "\u2A85",
  "Laplacetrf;": "\u2112",
  "laquo;": "\xAB",
  laquo: laquo$4,
  "Larr;": "\u219E",
  "lArr;": "\u21D0",
  "larr;": "\u2190",
  "larrb;": "\u21E4",
  "larrbfs;": "\u291F",
  "larrfs;": "\u291D",
  "larrhk;": "\u21A9",
  "larrlp;": "\u21AB",
  "larrpl;": "\u2939",
  "larrsim;": "\u2973",
  "larrtl;": "\u21A2",
  "lat;": "\u2AAB",
  "lAtail;": "\u291B",
  "latail;": "\u2919",
  "late;": "\u2AAD",
  "lates;": "\u2AAD\uFE00",
  "lBarr;": "\u290E",
  "lbarr;": "\u290C",
  "lbbrk;": "\u2772",
  "lbrace;": "{",
  "lbrack;": "[",
  "lbrke;": "\u298B",
  "lbrksld;": "\u298F",
  "lbrkslu;": "\u298D",
  "Lcaron;": "\u013D",
  "lcaron;": "\u013E",
  "Lcedil;": "\u013B",
  "lcedil;": "\u013C",
  "lceil;": "\u2308",
  "lcub;": "{",
  "Lcy;": "\u041B",
  "lcy;": "\u043B",
  "ldca;": "\u2936",
  "ldquo;": "\u201C",
  "ldquor;": "\u201E",
  "ldrdhar;": "\u2967",
  "ldrushar;": "\u294B",
  "ldsh;": "\u21B2",
  "lE;": "\u2266",
  "le;": "\u2264",
  "LeftAngleBracket;": "\u27E8",
  "LeftArrow;": "\u2190",
  "Leftarrow;": "\u21D0",
  "leftarrow;": "\u2190",
  "LeftArrowBar;": "\u21E4",
  "LeftArrowRightArrow;": "\u21C6",
  "leftarrowtail;": "\u21A2",
  "LeftCeiling;": "\u2308",
  "LeftDoubleBracket;": "\u27E6",
  "LeftDownTeeVector;": "\u2961",
  "LeftDownVector;": "\u21C3",
  "LeftDownVectorBar;": "\u2959",
  "LeftFloor;": "\u230A",
  "leftharpoondown;": "\u21BD",
  "leftharpoonup;": "\u21BC",
  "leftleftarrows;": "\u21C7",
  "LeftRightArrow;": "\u2194",
  "Leftrightarrow;": "\u21D4",
  "leftrightarrow;": "\u2194",
  "leftrightarrows;": "\u21C6",
  "leftrightharpoons;": "\u21CB",
  "leftrightsquigarrow;": "\u21AD",
  "LeftRightVector;": "\u294E",
  "LeftTee;": "\u22A3",
  "LeftTeeArrow;": "\u21A4",
  "LeftTeeVector;": "\u295A",
  "leftthreetimes;": "\u22CB",
  "LeftTriangle;": "\u22B2",
  "LeftTriangleBar;": "\u29CF",
  "LeftTriangleEqual;": "\u22B4",
  "LeftUpDownVector;": "\u2951",
  "LeftUpTeeVector;": "\u2960",
  "LeftUpVector;": "\u21BF",
  "LeftUpVectorBar;": "\u2958",
  "LeftVector;": "\u21BC",
  "LeftVectorBar;": "\u2952",
  "lEg;": "\u2A8B",
  "leg;": "\u22DA",
  "leq;": "\u2264",
  "leqq;": "\u2266",
  "leqslant;": "\u2A7D",
  "les;": "\u2A7D",
  "lescc;": "\u2AA8",
  "lesdot;": "\u2A7F",
  "lesdoto;": "\u2A81",
  "lesdotor;": "\u2A83",
  "lesg;": "\u22DA\uFE00",
  "lesges;": "\u2A93",
  "lessapprox;": "\u2A85",
  "lessdot;": "\u22D6",
  "lesseqgtr;": "\u22DA",
  "lesseqqgtr;": "\u2A8B",
  "LessEqualGreater;": "\u22DA",
  "LessFullEqual;": "\u2266",
  "LessGreater;": "\u2276",
  "lessgtr;": "\u2276",
  "LessLess;": "\u2AA1",
  "lesssim;": "\u2272",
  "LessSlantEqual;": "\u2A7D",
  "LessTilde;": "\u2272",
  "lfisht;": "\u297C",
  "lfloor;": "\u230A",
  "Lfr;": "\u{1D50F}",
  "lfr;": "\u{1D529}",
  "lg;": "\u2276",
  "lgE;": "\u2A91",
  "lHar;": "\u2962",
  "lhard;": "\u21BD",
  "lharu;": "\u21BC",
  "lharul;": "\u296A",
  "lhblk;": "\u2584",
  "LJcy;": "\u0409",
  "ljcy;": "\u0459",
  "Ll;": "\u22D8",
  "ll;": "\u226A",
  "llarr;": "\u21C7",
  "llcorner;": "\u231E",
  "Lleftarrow;": "\u21DA",
  "llhard;": "\u296B",
  "lltri;": "\u25FA",
  "Lmidot;": "\u013F",
  "lmidot;": "\u0140",
  "lmoust;": "\u23B0",
  "lmoustache;": "\u23B0",
  "lnap;": "\u2A89",
  "lnapprox;": "\u2A89",
  "lnE;": "\u2268",
  "lne;": "\u2A87",
  "lneq;": "\u2A87",
  "lneqq;": "\u2268",
  "lnsim;": "\u22E6",
  "loang;": "\u27EC",
  "loarr;": "\u21FD",
  "lobrk;": "\u27E6",
  "LongLeftArrow;": "\u27F5",
  "Longleftarrow;": "\u27F8",
  "longleftarrow;": "\u27F5",
  "LongLeftRightArrow;": "\u27F7",
  "Longleftrightarrow;": "\u27FA",
  "longleftrightarrow;": "\u27F7",
  "longmapsto;": "\u27FC",
  "LongRightArrow;": "\u27F6",
  "Longrightarrow;": "\u27F9",
  "longrightarrow;": "\u27F6",
  "looparrowleft;": "\u21AB",
  "looparrowright;": "\u21AC",
  "lopar;": "\u2985",
  "Lopf;": "\u{1D543}",
  "lopf;": "\u{1D55D}",
  "loplus;": "\u2A2D",
  "lotimes;": "\u2A34",
  "lowast;": "\u2217",
  "lowbar;": "_",
  "LowerLeftArrow;": "\u2199",
  "LowerRightArrow;": "\u2198",
  "loz;": "\u25CA",
  "lozenge;": "\u25CA",
  "lozf;": "\u29EB",
  "lpar;": "(",
  "lparlt;": "\u2993",
  "lrarr;": "\u21C6",
  "lrcorner;": "\u231F",
  "lrhar;": "\u21CB",
  "lrhard;": "\u296D",
  "lrm;": "\u200E",
  "lrtri;": "\u22BF",
  "lsaquo;": "\u2039",
  "Lscr;": "\u2112",
  "lscr;": "\u{1D4C1}",
  "Lsh;": "\u21B0",
  "lsh;": "\u21B0",
  "lsim;": "\u2272",
  "lsime;": "\u2A8D",
  "lsimg;": "\u2A8F",
  "lsqb;": "[",
  "lsquo;": "\u2018",
  "lsquor;": "\u201A",
  "Lstrok;": "\u0141",
  "lstrok;": "\u0142",
  "LT;": "<",
  LT: LT$4,
  "Lt;": "\u226A",
  "lt;": "<",
  lt: lt$6,
  "ltcc;": "\u2AA6",
  "ltcir;": "\u2A79",
  "ltdot;": "\u22D6",
  "lthree;": "\u22CB",
  "ltimes;": "\u22C9",
  "ltlarr;": "\u2976",
  "ltquest;": "\u2A7B",
  "ltri;": "\u25C3",
  "ltrie;": "\u22B4",
  "ltrif;": "\u25C2",
  "ltrPar;": "\u2996",
  "lurdshar;": "\u294A",
  "luruhar;": "\u2966",
  "lvertneqq;": "\u2268\uFE00",
  "lvnE;": "\u2268\uFE00",
  "macr;": "\xAF",
  macr: macr$4,
  "male;": "\u2642",
  "malt;": "\u2720",
  "maltese;": "\u2720",
  "Map;": "\u2905",
  "map;": "\u21A6",
  "mapsto;": "\u21A6",
  "mapstodown;": "\u21A7",
  "mapstoleft;": "\u21A4",
  "mapstoup;": "\u21A5",
  "marker;": "\u25AE",
  "mcomma;": "\u2A29",
  "Mcy;": "\u041C",
  "mcy;": "\u043C",
  "mdash;": "\u2014",
  "mDDot;": "\u223A",
  "measuredangle;": "\u2221",
  "MediumSpace;": "\u205F",
  "Mellintrf;": "\u2133",
  "Mfr;": "\u{1D510}",
  "mfr;": "\u{1D52A}",
  "mho;": "\u2127",
  "micro;": "\xB5",
  micro: micro$4,
  "mid;": "\u2223",
  "midast;": "*",
  "midcir;": "\u2AF0",
  "middot;": "\xB7",
  middot: middot$4,
  "minus;": "\u2212",
  "minusb;": "\u229F",
  "minusd;": "\u2238",
  "minusdu;": "\u2A2A",
  "MinusPlus;": "\u2213",
  "mlcp;": "\u2ADB",
  "mldr;": "\u2026",
  "mnplus;": "\u2213",
  "models;": "\u22A7",
  "Mopf;": "\u{1D544}",
  "mopf;": "\u{1D55E}",
  "mp;": "\u2213",
  "Mscr;": "\u2133",
  "mscr;": "\u{1D4C2}",
  "mstpos;": "\u223E",
  "Mu;": "\u039C",
  "mu;": "\u03BC",
  "multimap;": "\u22B8",
  "mumap;": "\u22B8",
  "nabla;": "\u2207",
  "Nacute;": "\u0143",
  "nacute;": "\u0144",
  "nang;": "\u2220\u20D2",
  "nap;": "\u2249",
  "napE;": "\u2A70\u0338",
  "napid;": "\u224B\u0338",
  "napos;": "\u0149",
  "napprox;": "\u2249",
  "natur;": "\u266E",
  "natural;": "\u266E",
  "naturals;": "\u2115",
  "nbsp;": "\xA0",
  nbsp: nbsp$4,
  "nbump;": "\u224E\u0338",
  "nbumpe;": "\u224F\u0338",
  "ncap;": "\u2A43",
  "Ncaron;": "\u0147",
  "ncaron;": "\u0148",
  "Ncedil;": "\u0145",
  "ncedil;": "\u0146",
  "ncong;": "\u2247",
  "ncongdot;": "\u2A6D\u0338",
  "ncup;": "\u2A42",
  "Ncy;": "\u041D",
  "ncy;": "\u043D",
  "ndash;": "\u2013",
  "ne;": "\u2260",
  "nearhk;": "\u2924",
  "neArr;": "\u21D7",
  "nearr;": "\u2197",
  "nearrow;": "\u2197",
  "nedot;": "\u2250\u0338",
  "NegativeMediumSpace;": "\u200B",
  "NegativeThickSpace;": "\u200B",
  "NegativeThinSpace;": "\u200B",
  "NegativeVeryThinSpace;": "\u200B",
  "nequiv;": "\u2262",
  "nesear;": "\u2928",
  "nesim;": "\u2242\u0338",
  "NestedGreaterGreater;": "\u226B",
  "NestedLessLess;": "\u226A",
  "NewLine;": "\n",
  "nexist;": "\u2204",
  "nexists;": "\u2204",
  "Nfr;": "\u{1D511}",
  "nfr;": "\u{1D52B}",
  "ngE;": "\u2267\u0338",
  "nge;": "\u2271",
  "ngeq;": "\u2271",
  "ngeqq;": "\u2267\u0338",
  "ngeqslant;": "\u2A7E\u0338",
  "nges;": "\u2A7E\u0338",
  "nGg;": "\u22D9\u0338",
  "ngsim;": "\u2275",
  "nGt;": "\u226B\u20D2",
  "ngt;": "\u226F",
  "ngtr;": "\u226F",
  "nGtv;": "\u226B\u0338",
  "nhArr;": "\u21CE",
  "nharr;": "\u21AE",
  "nhpar;": "\u2AF2",
  "ni;": "\u220B",
  "nis;": "\u22FC",
  "nisd;": "\u22FA",
  "niv;": "\u220B",
  "NJcy;": "\u040A",
  "njcy;": "\u045A",
  "nlArr;": "\u21CD",
  "nlarr;": "\u219A",
  "nldr;": "\u2025",
  "nlE;": "\u2266\u0338",
  "nle;": "\u2270",
  "nLeftarrow;": "\u21CD",
  "nleftarrow;": "\u219A",
  "nLeftrightarrow;": "\u21CE",
  "nleftrightarrow;": "\u21AE",
  "nleq;": "\u2270",
  "nleqq;": "\u2266\u0338",
  "nleqslant;": "\u2A7D\u0338",
  "nles;": "\u2A7D\u0338",
  "nless;": "\u226E",
  "nLl;": "\u22D8\u0338",
  "nlsim;": "\u2274",
  "nLt;": "\u226A\u20D2",
  "nlt;": "\u226E",
  "nltri;": "\u22EA",
  "nltrie;": "\u22EC",
  "nLtv;": "\u226A\u0338",
  "nmid;": "\u2224",
  "NoBreak;": "\u2060",
  "NonBreakingSpace;": "\xA0",
  "Nopf;": "\u2115",
  "nopf;": "\u{1D55F}",
  "Not;": "\u2AEC",
  "not;": "\xAC",
  not: not$4,
  "NotCongruent;": "\u2262",
  "NotCupCap;": "\u226D",
  "NotDoubleVerticalBar;": "\u2226",
  "NotElement;": "\u2209",
  "NotEqual;": "\u2260",
  "NotEqualTilde;": "\u2242\u0338",
  "NotExists;": "\u2204",
  "NotGreater;": "\u226F",
  "NotGreaterEqual;": "\u2271",
  "NotGreaterFullEqual;": "\u2267\u0338",
  "NotGreaterGreater;": "\u226B\u0338",
  "NotGreaterLess;": "\u2279",
  "NotGreaterSlantEqual;": "\u2A7E\u0338",
  "NotGreaterTilde;": "\u2275",
  "NotHumpDownHump;": "\u224E\u0338",
  "NotHumpEqual;": "\u224F\u0338",
  "notin;": "\u2209",
  "notindot;": "\u22F5\u0338",
  "notinE;": "\u22F9\u0338",
  "notinva;": "\u2209",
  "notinvb;": "\u22F7",
  "notinvc;": "\u22F6",
  "NotLeftTriangle;": "\u22EA",
  "NotLeftTriangleBar;": "\u29CF\u0338",
  "NotLeftTriangleEqual;": "\u22EC",
  "NotLess;": "\u226E",
  "NotLessEqual;": "\u2270",
  "NotLessGreater;": "\u2278",
  "NotLessLess;": "\u226A\u0338",
  "NotLessSlantEqual;": "\u2A7D\u0338",
  "NotLessTilde;": "\u2274",
  "NotNestedGreaterGreater;": "\u2AA2\u0338",
  "NotNestedLessLess;": "\u2AA1\u0338",
  "notni;": "\u220C",
  "notniva;": "\u220C",
  "notnivb;": "\u22FE",
  "notnivc;": "\u22FD",
  "NotPrecedes;": "\u2280",
  "NotPrecedesEqual;": "\u2AAF\u0338",
  "NotPrecedesSlantEqual;": "\u22E0",
  "NotReverseElement;": "\u220C",
  "NotRightTriangle;": "\u22EB",
  "NotRightTriangleBar;": "\u29D0\u0338",
  "NotRightTriangleEqual;": "\u22ED",
  "NotSquareSubset;": "\u228F\u0338",
  "NotSquareSubsetEqual;": "\u22E2",
  "NotSquareSuperset;": "\u2290\u0338",
  "NotSquareSupersetEqual;": "\u22E3",
  "NotSubset;": "\u2282\u20D2",
  "NotSubsetEqual;": "\u2288",
  "NotSucceeds;": "\u2281",
  "NotSucceedsEqual;": "\u2AB0\u0338",
  "NotSucceedsSlantEqual;": "\u22E1",
  "NotSucceedsTilde;": "\u227F\u0338",
  "NotSuperset;": "\u2283\u20D2",
  "NotSupersetEqual;": "\u2289",
  "NotTilde;": "\u2241",
  "NotTildeEqual;": "\u2244",
  "NotTildeFullEqual;": "\u2247",
  "NotTildeTilde;": "\u2249",
  "NotVerticalBar;": "\u2224",
  "npar;": "\u2226",
  "nparallel;": "\u2226",
  "nparsl;": "\u2AFD\u20E5",
  "npart;": "\u2202\u0338",
  "npolint;": "\u2A14",
  "npr;": "\u2280",
  "nprcue;": "\u22E0",
  "npre;": "\u2AAF\u0338",
  "nprec;": "\u2280",
  "npreceq;": "\u2AAF\u0338",
  "nrArr;": "\u21CF",
  "nrarr;": "\u219B",
  "nrarrc;": "\u2933\u0338",
  "nrarrw;": "\u219D\u0338",
  "nRightarrow;": "\u21CF",
  "nrightarrow;": "\u219B",
  "nrtri;": "\u22EB",
  "nrtrie;": "\u22ED",
  "nsc;": "\u2281",
  "nsccue;": "\u22E1",
  "nsce;": "\u2AB0\u0338",
  "Nscr;": "\u{1D4A9}",
  "nscr;": "\u{1D4C3}",
  "nshortmid;": "\u2224",
  "nshortparallel;": "\u2226",
  "nsim;": "\u2241",
  "nsime;": "\u2244",
  "nsimeq;": "\u2244",
  "nsmid;": "\u2224",
  "nspar;": "\u2226",
  "nsqsube;": "\u22E2",
  "nsqsupe;": "\u22E3",
  "nsub;": "\u2284",
  "nsubE;": "\u2AC5\u0338",
  "nsube;": "\u2288",
  "nsubset;": "\u2282\u20D2",
  "nsubseteq;": "\u2288",
  "nsubseteqq;": "\u2AC5\u0338",
  "nsucc;": "\u2281",
  "nsucceq;": "\u2AB0\u0338",
  "nsup;": "\u2285",
  "nsupE;": "\u2AC6\u0338",
  "nsupe;": "\u2289",
  "nsupset;": "\u2283\u20D2",
  "nsupseteq;": "\u2289",
  "nsupseteqq;": "\u2AC6\u0338",
  "ntgl;": "\u2279",
  "Ntilde;": "\xD1",
  Ntilde: Ntilde$4,
  "ntilde;": "\xF1",
  ntilde: ntilde$4,
  "ntlg;": "\u2278",
  "ntriangleleft;": "\u22EA",
  "ntrianglelefteq;": "\u22EC",
  "ntriangleright;": "\u22EB",
  "ntrianglerighteq;": "\u22ED",
  "Nu;": "\u039D",
  "nu;": "\u03BD",
  "num;": "#",
  "numero;": "\u2116",
  "numsp;": "\u2007",
  "nvap;": "\u224D\u20D2",
  "nVDash;": "\u22AF",
  "nVdash;": "\u22AE",
  "nvDash;": "\u22AD",
  "nvdash;": "\u22AC",
  "nvge;": "\u2265\u20D2",
  "nvgt;": ">\u20D2",
  "nvHarr;": "\u2904",
  "nvinfin;": "\u29DE",
  "nvlArr;": "\u2902",
  "nvle;": "\u2264\u20D2",
  "nvlt;": "<\u20D2",
  "nvltrie;": "\u22B4\u20D2",
  "nvrArr;": "\u2903",
  "nvrtrie;": "\u22B5\u20D2",
  "nvsim;": "\u223C\u20D2",
  "nwarhk;": "\u2923",
  "nwArr;": "\u21D6",
  "nwarr;": "\u2196",
  "nwarrow;": "\u2196",
  "nwnear;": "\u2927",
  "Oacute;": "\xD3",
  Oacute: Oacute$4,
  "oacute;": "\xF3",
  oacute: oacute$4,
  "oast;": "\u229B",
  "ocir;": "\u229A",
  "Ocirc;": "\xD4",
  Ocirc: Ocirc$4,
  "ocirc;": "\xF4",
  ocirc: ocirc$4,
  "Ocy;": "\u041E",
  "ocy;": "\u043E",
  "odash;": "\u229D",
  "Odblac;": "\u0150",
  "odblac;": "\u0151",
  "odiv;": "\u2A38",
  "odot;": "\u2299",
  "odsold;": "\u29BC",
  "OElig;": "\u0152",
  "oelig;": "\u0153",
  "ofcir;": "\u29BF",
  "Ofr;": "\u{1D512}",
  "ofr;": "\u{1D52C}",
  "ogon;": "\u02DB",
  "Ograve;": "\xD2",
  Ograve: Ograve$4,
  "ograve;": "\xF2",
  ograve: ograve$4,
  "ogt;": "\u29C1",
  "ohbar;": "\u29B5",
  "ohm;": "\u03A9",
  "oint;": "\u222E",
  "olarr;": "\u21BA",
  "olcir;": "\u29BE",
  "olcross;": "\u29BB",
  "oline;": "\u203E",
  "olt;": "\u29C0",
  "Omacr;": "\u014C",
  "omacr;": "\u014D",
  "Omega;": "\u03A9",
  "omega;": "\u03C9",
  "Omicron;": "\u039F",
  "omicron;": "\u03BF",
  "omid;": "\u29B6",
  "ominus;": "\u2296",
  "Oopf;": "\u{1D546}",
  "oopf;": "\u{1D560}",
  "opar;": "\u29B7",
  "OpenCurlyDoubleQuote;": "\u201C",
  "OpenCurlyQuote;": "\u2018",
  "operp;": "\u29B9",
  "oplus;": "\u2295",
  "Or;": "\u2A54",
  "or;": "\u2228",
  "orarr;": "\u21BB",
  "ord;": "\u2A5D",
  "order;": "\u2134",
  "orderof;": "\u2134",
  "ordf;": "\xAA",
  ordf: ordf$4,
  "ordm;": "\xBA",
  ordm: ordm$4,
  "origof;": "\u22B6",
  "oror;": "\u2A56",
  "orslope;": "\u2A57",
  "orv;": "\u2A5B",
  "oS;": "\u24C8",
  "Oscr;": "\u{1D4AA}",
  "oscr;": "\u2134",
  "Oslash;": "\xD8",
  Oslash: Oslash$4,
  "oslash;": "\xF8",
  oslash: oslash$4,
  "osol;": "\u2298",
  "Otilde;": "\xD5",
  Otilde: Otilde$4,
  "otilde;": "\xF5",
  otilde: otilde$4,
  "Otimes;": "\u2A37",
  "otimes;": "\u2297",
  "otimesas;": "\u2A36",
  "Ouml;": "\xD6",
  Ouml: Ouml$4,
  "ouml;": "\xF6",
  ouml: ouml$4,
  "ovbar;": "\u233D",
  "OverBar;": "\u203E",
  "OverBrace;": "\u23DE",
  "OverBracket;": "\u23B4",
  "OverParenthesis;": "\u23DC",
  "par;": "\u2225",
  "para;": "\xB6",
  para: para$4,
  "parallel;": "\u2225",
  "parsim;": "\u2AF3",
  "parsl;": "\u2AFD",
  "part;": "\u2202",
  "PartialD;": "\u2202",
  "Pcy;": "\u041F",
  "pcy;": "\u043F",
  "percnt;": "%",
  "period;": ".",
  "permil;": "\u2030",
  "perp;": "\u22A5",
  "pertenk;": "\u2031",
  "Pfr;": "\u{1D513}",
  "pfr;": "\u{1D52D}",
  "Phi;": "\u03A6",
  "phi;": "\u03C6",
  "phiv;": "\u03D5",
  "phmmat;": "\u2133",
  "phone;": "\u260E",
  "Pi;": "\u03A0",
  "pi;": "\u03C0",
  "pitchfork;": "\u22D4",
  "piv;": "\u03D6",
  "planck;": "\u210F",
  "planckh;": "\u210E",
  "plankv;": "\u210F",
  "plus;": "+",
  "plusacir;": "\u2A23",
  "plusb;": "\u229E",
  "pluscir;": "\u2A22",
  "plusdo;": "\u2214",
  "plusdu;": "\u2A25",
  "pluse;": "\u2A72",
  "PlusMinus;": "\xB1",
  "plusmn;": "\xB1",
  plusmn: plusmn$4,
  "plussim;": "\u2A26",
  "plustwo;": "\u2A27",
  "pm;": "\xB1",
  "Poincareplane;": "\u210C",
  "pointint;": "\u2A15",
  "Popf;": "\u2119",
  "popf;": "\u{1D561}",
  "pound;": "\xA3",
  pound: pound$4,
  "Pr;": "\u2ABB",
  "pr;": "\u227A",
  "prap;": "\u2AB7",
  "prcue;": "\u227C",
  "prE;": "\u2AB3",
  "pre;": "\u2AAF",
  "prec;": "\u227A",
  "precapprox;": "\u2AB7",
  "preccurlyeq;": "\u227C",
  "Precedes;": "\u227A",
  "PrecedesEqual;": "\u2AAF",
  "PrecedesSlantEqual;": "\u227C",
  "PrecedesTilde;": "\u227E",
  "preceq;": "\u2AAF",
  "precnapprox;": "\u2AB9",
  "precneqq;": "\u2AB5",
  "precnsim;": "\u22E8",
  "precsim;": "\u227E",
  "Prime;": "\u2033",
  "prime;": "\u2032",
  "primes;": "\u2119",
  "prnap;": "\u2AB9",
  "prnE;": "\u2AB5",
  "prnsim;": "\u22E8",
  "prod;": "\u220F",
  "Product;": "\u220F",
  "profalar;": "\u232E",
  "profline;": "\u2312",
  "profsurf;": "\u2313",
  "prop;": "\u221D",
  "Proportion;": "\u2237",
  "Proportional;": "\u221D",
  "propto;": "\u221D",
  "prsim;": "\u227E",
  "prurel;": "\u22B0",
  "Pscr;": "\u{1D4AB}",
  "pscr;": "\u{1D4C5}",
  "Psi;": "\u03A8",
  "psi;": "\u03C8",
  "puncsp;": "\u2008",
  "Qfr;": "\u{1D514}",
  "qfr;": "\u{1D52E}",
  "qint;": "\u2A0C",
  "Qopf;": "\u211A",
  "qopf;": "\u{1D562}",
  "qprime;": "\u2057",
  "Qscr;": "\u{1D4AC}",
  "qscr;": "\u{1D4C6}",
  "quaternions;": "\u210D",
  "quatint;": "\u2A16",
  "quest;": "?",
  "questeq;": "\u225F",
  "QUOT;": '"',
  QUOT: QUOT$4,
  "quot;": '"',
  quot: quot$6,
  "rAarr;": "\u21DB",
  "race;": "\u223D\u0331",
  "Racute;": "\u0154",
  "racute;": "\u0155",
  "radic;": "\u221A",
  "raemptyv;": "\u29B3",
  "Rang;": "\u27EB",
  "rang;": "\u27E9",
  "rangd;": "\u2992",
  "range;": "\u29A5",
  "rangle;": "\u27E9",
  "raquo;": "\xBB",
  raquo: raquo$4,
  "Rarr;": "\u21A0",
  "rArr;": "\u21D2",
  "rarr;": "\u2192",
  "rarrap;": "\u2975",
  "rarrb;": "\u21E5",
  "rarrbfs;": "\u2920",
  "rarrc;": "\u2933",
  "rarrfs;": "\u291E",
  "rarrhk;": "\u21AA",
  "rarrlp;": "\u21AC",
  "rarrpl;": "\u2945",
  "rarrsim;": "\u2974",
  "Rarrtl;": "\u2916",
  "rarrtl;": "\u21A3",
  "rarrw;": "\u219D",
  "rAtail;": "\u291C",
  "ratail;": "\u291A",
  "ratio;": "\u2236",
  "rationals;": "\u211A",
  "RBarr;": "\u2910",
  "rBarr;": "\u290F",
  "rbarr;": "\u290D",
  "rbbrk;": "\u2773",
  "rbrace;": "}",
  "rbrack;": "]",
  "rbrke;": "\u298C",
  "rbrksld;": "\u298E",
  "rbrkslu;": "\u2990",
  "Rcaron;": "\u0158",
  "rcaron;": "\u0159",
  "Rcedil;": "\u0156",
  "rcedil;": "\u0157",
  "rceil;": "\u2309",
  "rcub;": "}",
  "Rcy;": "\u0420",
  "rcy;": "\u0440",
  "rdca;": "\u2937",
  "rdldhar;": "\u2969",
  "rdquo;": "\u201D",
  "rdquor;": "\u201D",
  "rdsh;": "\u21B3",
  "Re;": "\u211C",
  "real;": "\u211C",
  "realine;": "\u211B",
  "realpart;": "\u211C",
  "reals;": "\u211D",
  "rect;": "\u25AD",
  "REG;": "\xAE",
  REG: REG$4,
  "reg;": "\xAE",
  reg: reg$4,
  "ReverseElement;": "\u220B",
  "ReverseEquilibrium;": "\u21CB",
  "ReverseUpEquilibrium;": "\u296F",
  "rfisht;": "\u297D",
  "rfloor;": "\u230B",
  "Rfr;": "\u211C",
  "rfr;": "\u{1D52F}",
  "rHar;": "\u2964",
  "rhard;": "\u21C1",
  "rharu;": "\u21C0",
  "rharul;": "\u296C",
  "Rho;": "\u03A1",
  "rho;": "\u03C1",
  "rhov;": "\u03F1",
  "RightAngleBracket;": "\u27E9",
  "RightArrow;": "\u2192",
  "Rightarrow;": "\u21D2",
  "rightarrow;": "\u2192",
  "RightArrowBar;": "\u21E5",
  "RightArrowLeftArrow;": "\u21C4",
  "rightarrowtail;": "\u21A3",
  "RightCeiling;": "\u2309",
  "RightDoubleBracket;": "\u27E7",
  "RightDownTeeVector;": "\u295D",
  "RightDownVector;": "\u21C2",
  "RightDownVectorBar;": "\u2955",
  "RightFloor;": "\u230B",
  "rightharpoondown;": "\u21C1",
  "rightharpoonup;": "\u21C0",
  "rightleftarrows;": "\u21C4",
  "rightleftharpoons;": "\u21CC",
  "rightrightarrows;": "\u21C9",
  "rightsquigarrow;": "\u219D",
  "RightTee;": "\u22A2",
  "RightTeeArrow;": "\u21A6",
  "RightTeeVector;": "\u295B",
  "rightthreetimes;": "\u22CC",
  "RightTriangle;": "\u22B3",
  "RightTriangleBar;": "\u29D0",
  "RightTriangleEqual;": "\u22B5",
  "RightUpDownVector;": "\u294F",
  "RightUpTeeVector;": "\u295C",
  "RightUpVector;": "\u21BE",
  "RightUpVectorBar;": "\u2954",
  "RightVector;": "\u21C0",
  "RightVectorBar;": "\u2953",
  "ring;": "\u02DA",
  "risingdotseq;": "\u2253",
  "rlarr;": "\u21C4",
  "rlhar;": "\u21CC",
  "rlm;": "\u200F",
  "rmoust;": "\u23B1",
  "rmoustache;": "\u23B1",
  "rnmid;": "\u2AEE",
  "roang;": "\u27ED",
  "roarr;": "\u21FE",
  "robrk;": "\u27E7",
  "ropar;": "\u2986",
  "Ropf;": "\u211D",
  "ropf;": "\u{1D563}",
  "roplus;": "\u2A2E",
  "rotimes;": "\u2A35",
  "RoundImplies;": "\u2970",
  "rpar;": ")",
  "rpargt;": "\u2994",
  "rppolint;": "\u2A12",
  "rrarr;": "\u21C9",
  "Rrightarrow;": "\u21DB",
  "rsaquo;": "\u203A",
  "Rscr;": "\u211B",
  "rscr;": "\u{1D4C7}",
  "Rsh;": "\u21B1",
  "rsh;": "\u21B1",
  "rsqb;": "]",
  "rsquo;": "\u2019",
  "rsquor;": "\u2019",
  "rthree;": "\u22CC",
  "rtimes;": "\u22CA",
  "rtri;": "\u25B9",
  "rtrie;": "\u22B5",
  "rtrif;": "\u25B8",
  "rtriltri;": "\u29CE",
  "RuleDelayed;": "\u29F4",
  "ruluhar;": "\u2968",
  "rx;": "\u211E",
  "Sacute;": "\u015A",
  "sacute;": "\u015B",
  "sbquo;": "\u201A",
  "Sc;": "\u2ABC",
  "sc;": "\u227B",
  "scap;": "\u2AB8",
  "Scaron;": "\u0160",
  "scaron;": "\u0161",
  "sccue;": "\u227D",
  "scE;": "\u2AB4",
  "sce;": "\u2AB0",
  "Scedil;": "\u015E",
  "scedil;": "\u015F",
  "Scirc;": "\u015C",
  "scirc;": "\u015D",
  "scnap;": "\u2ABA",
  "scnE;": "\u2AB6",
  "scnsim;": "\u22E9",
  "scpolint;": "\u2A13",
  "scsim;": "\u227F",
  "Scy;": "\u0421",
  "scy;": "\u0441",
  "sdot;": "\u22C5",
  "sdotb;": "\u22A1",
  "sdote;": "\u2A66",
  "searhk;": "\u2925",
  "seArr;": "\u21D8",
  "searr;": "\u2198",
  "searrow;": "\u2198",
  "sect;": "\xA7",
  sect: sect$4,
  "semi;": ";",
  "seswar;": "\u2929",
  "setminus;": "\u2216",
  "setmn;": "\u2216",
  "sext;": "\u2736",
  "Sfr;": "\u{1D516}",
  "sfr;": "\u{1D530}",
  "sfrown;": "\u2322",
  "sharp;": "\u266F",
  "SHCHcy;": "\u0429",
  "shchcy;": "\u0449",
  "SHcy;": "\u0428",
  "shcy;": "\u0448",
  "ShortDownArrow;": "\u2193",
  "ShortLeftArrow;": "\u2190",
  "shortmid;": "\u2223",
  "shortparallel;": "\u2225",
  "ShortRightArrow;": "\u2192",
  "ShortUpArrow;": "\u2191",
  "shy;": "\xAD",
  shy: shy$4,
  "Sigma;": "\u03A3",
  "sigma;": "\u03C3",
  "sigmaf;": "\u03C2",
  "sigmav;": "\u03C2",
  "sim;": "\u223C",
  "simdot;": "\u2A6A",
  "sime;": "\u2243",
  "simeq;": "\u2243",
  "simg;": "\u2A9E",
  "simgE;": "\u2AA0",
  "siml;": "\u2A9D",
  "simlE;": "\u2A9F",
  "simne;": "\u2246",
  "simplus;": "\u2A24",
  "simrarr;": "\u2972",
  "slarr;": "\u2190",
  "SmallCircle;": "\u2218",
  "smallsetminus;": "\u2216",
  "smashp;": "\u2A33",
  "smeparsl;": "\u29E4",
  "smid;": "\u2223",
  "smile;": "\u2323",
  "smt;": "\u2AAA",
  "smte;": "\u2AAC",
  "smtes;": "\u2AAC\uFE00",
  "SOFTcy;": "\u042C",
  "softcy;": "\u044C",
  "sol;": "/",
  "solb;": "\u29C4",
  "solbar;": "\u233F",
  "Sopf;": "\u{1D54A}",
  "sopf;": "\u{1D564}",
  "spades;": "\u2660",
  "spadesuit;": "\u2660",
  "spar;": "\u2225",
  "sqcap;": "\u2293",
  "sqcaps;": "\u2293\uFE00",
  "sqcup;": "\u2294",
  "sqcups;": "\u2294\uFE00",
  "Sqrt;": "\u221A",
  "sqsub;": "\u228F",
  "sqsube;": "\u2291",
  "sqsubset;": "\u228F",
  "sqsubseteq;": "\u2291",
  "sqsup;": "\u2290",
  "sqsupe;": "\u2292",
  "sqsupset;": "\u2290",
  "sqsupseteq;": "\u2292",
  "squ;": "\u25A1",
  "Square;": "\u25A1",
  "square;": "\u25A1",
  "SquareIntersection;": "\u2293",
  "SquareSubset;": "\u228F",
  "SquareSubsetEqual;": "\u2291",
  "SquareSuperset;": "\u2290",
  "SquareSupersetEqual;": "\u2292",
  "SquareUnion;": "\u2294",
  "squarf;": "\u25AA",
  "squf;": "\u25AA",
  "srarr;": "\u2192",
  "Sscr;": "\u{1D4AE}",
  "sscr;": "\u{1D4C8}",
  "ssetmn;": "\u2216",
  "ssmile;": "\u2323",
  "sstarf;": "\u22C6",
  "Star;": "\u22C6",
  "star;": "\u2606",
  "starf;": "\u2605",
  "straightepsilon;": "\u03F5",
  "straightphi;": "\u03D5",
  "strns;": "\xAF",
  "Sub;": "\u22D0",
  "sub;": "\u2282",
  "subdot;": "\u2ABD",
  "subE;": "\u2AC5",
  "sube;": "\u2286",
  "subedot;": "\u2AC3",
  "submult;": "\u2AC1",
  "subnE;": "\u2ACB",
  "subne;": "\u228A",
  "subplus;": "\u2ABF",
  "subrarr;": "\u2979",
  "Subset;": "\u22D0",
  "subset;": "\u2282",
  "subseteq;": "\u2286",
  "subseteqq;": "\u2AC5",
  "SubsetEqual;": "\u2286",
  "subsetneq;": "\u228A",
  "subsetneqq;": "\u2ACB",
  "subsim;": "\u2AC7",
  "subsub;": "\u2AD5",
  "subsup;": "\u2AD3",
  "succ;": "\u227B",
  "succapprox;": "\u2AB8",
  "succcurlyeq;": "\u227D",
  "Succeeds;": "\u227B",
  "SucceedsEqual;": "\u2AB0",
  "SucceedsSlantEqual;": "\u227D",
  "SucceedsTilde;": "\u227F",
  "succeq;": "\u2AB0",
  "succnapprox;": "\u2ABA",
  "succneqq;": "\u2AB6",
  "succnsim;": "\u22E9",
  "succsim;": "\u227F",
  "SuchThat;": "\u220B",
  "Sum;": "\u2211",
  "sum;": "\u2211",
  "sung;": "\u266A",
  "Sup;": "\u22D1",
  "sup;": "\u2283",
  "sup1;": "\xB9",
  sup1: sup1$4,
  "sup2;": "\xB2",
  sup2: sup2$4,
  "sup3;": "\xB3",
  sup3: sup3$4,
  "supdot;": "\u2ABE",
  "supdsub;": "\u2AD8",
  "supE;": "\u2AC6",
  "supe;": "\u2287",
  "supedot;": "\u2AC4",
  "Superset;": "\u2283",
  "SupersetEqual;": "\u2287",
  "suphsol;": "\u27C9",
  "suphsub;": "\u2AD7",
  "suplarr;": "\u297B",
  "supmult;": "\u2AC2",
  "supnE;": "\u2ACC",
  "supne;": "\u228B",
  "supplus;": "\u2AC0",
  "Supset;": "\u22D1",
  "supset;": "\u2283",
  "supseteq;": "\u2287",
  "supseteqq;": "\u2AC6",
  "supsetneq;": "\u228B",
  "supsetneqq;": "\u2ACC",
  "supsim;": "\u2AC8",
  "supsub;": "\u2AD4",
  "supsup;": "\u2AD6",
  "swarhk;": "\u2926",
  "swArr;": "\u21D9",
  "swarr;": "\u2199",
  "swarrow;": "\u2199",
  "swnwar;": "\u292A",
  "szlig;": "\xDF",
  szlig: szlig$4,
  "Tab;": "	",
  "target;": "\u2316",
  "Tau;": "\u03A4",
  "tau;": "\u03C4",
  "tbrk;": "\u23B4",
  "Tcaron;": "\u0164",
  "tcaron;": "\u0165",
  "Tcedil;": "\u0162",
  "tcedil;": "\u0163",
  "Tcy;": "\u0422",
  "tcy;": "\u0442",
  "tdot;": "\u20DB",
  "telrec;": "\u2315",
  "Tfr;": "\u{1D517}",
  "tfr;": "\u{1D531}",
  "there4;": "\u2234",
  "Therefore;": "\u2234",
  "therefore;": "\u2234",
  "Theta;": "\u0398",
  "theta;": "\u03B8",
  "thetasym;": "\u03D1",
  "thetav;": "\u03D1",
  "thickapprox;": "\u2248",
  "thicksim;": "\u223C",
  "ThickSpace;": "\u205F\u200A",
  "thinsp;": "\u2009",
  "ThinSpace;": "\u2009",
  "thkap;": "\u2248",
  "thksim;": "\u223C",
  "THORN;": "\xDE",
  THORN: THORN$4,
  "thorn;": "\xFE",
  thorn: thorn$4,
  "Tilde;": "\u223C",
  "tilde;": "\u02DC",
  "TildeEqual;": "\u2243",
  "TildeFullEqual;": "\u2245",
  "TildeTilde;": "\u2248",
  "times;": "\xD7",
  times: times$4,
  "timesb;": "\u22A0",
  "timesbar;": "\u2A31",
  "timesd;": "\u2A30",
  "tint;": "\u222D",
  "toea;": "\u2928",
  "top;": "\u22A4",
  "topbot;": "\u2336",
  "topcir;": "\u2AF1",
  "Topf;": "\u{1D54B}",
  "topf;": "\u{1D565}",
  "topfork;": "\u2ADA",
  "tosa;": "\u2929",
  "tprime;": "\u2034",
  "TRADE;": "\u2122",
  "trade;": "\u2122",
  "triangle;": "\u25B5",
  "triangledown;": "\u25BF",
  "triangleleft;": "\u25C3",
  "trianglelefteq;": "\u22B4",
  "triangleq;": "\u225C",
  "triangleright;": "\u25B9",
  "trianglerighteq;": "\u22B5",
  "tridot;": "\u25EC",
  "trie;": "\u225C",
  "triminus;": "\u2A3A",
  "TripleDot;": "\u20DB",
  "triplus;": "\u2A39",
  "trisb;": "\u29CD",
  "tritime;": "\u2A3B",
  "trpezium;": "\u23E2",
  "Tscr;": "\u{1D4AF}",
  "tscr;": "\u{1D4C9}",
  "TScy;": "\u0426",
  "tscy;": "\u0446",
  "TSHcy;": "\u040B",
  "tshcy;": "\u045B",
  "Tstrok;": "\u0166",
  "tstrok;": "\u0167",
  "twixt;": "\u226C",
  "twoheadleftarrow;": "\u219E",
  "twoheadrightarrow;": "\u21A0",
  "Uacute;": "\xDA",
  Uacute: Uacute$4,
  "uacute;": "\xFA",
  uacute: uacute$4,
  "Uarr;": "\u219F",
  "uArr;": "\u21D1",
  "uarr;": "\u2191",
  "Uarrocir;": "\u2949",
  "Ubrcy;": "\u040E",
  "ubrcy;": "\u045E",
  "Ubreve;": "\u016C",
  "ubreve;": "\u016D",
  "Ucirc;": "\xDB",
  Ucirc: Ucirc$4,
  "ucirc;": "\xFB",
  ucirc: ucirc$4,
  "Ucy;": "\u0423",
  "ucy;": "\u0443",
  "udarr;": "\u21C5",
  "Udblac;": "\u0170",
  "udblac;": "\u0171",
  "udhar;": "\u296E",
  "ufisht;": "\u297E",
  "Ufr;": "\u{1D518}",
  "ufr;": "\u{1D532}",
  "Ugrave;": "\xD9",
  Ugrave: Ugrave$4,
  "ugrave;": "\xF9",
  ugrave: ugrave$4,
  "uHar;": "\u2963",
  "uharl;": "\u21BF",
  "uharr;": "\u21BE",
  "uhblk;": "\u2580",
  "ulcorn;": "\u231C",
  "ulcorner;": "\u231C",
  "ulcrop;": "\u230F",
  "ultri;": "\u25F8",
  "Umacr;": "\u016A",
  "umacr;": "\u016B",
  "uml;": "\xA8",
  uml: uml$4,
  "UnderBar;": "_",
  "UnderBrace;": "\u23DF",
  "UnderBracket;": "\u23B5",
  "UnderParenthesis;": "\u23DD",
  "Union;": "\u22C3",
  "UnionPlus;": "\u228E",
  "Uogon;": "\u0172",
  "uogon;": "\u0173",
  "Uopf;": "\u{1D54C}",
  "uopf;": "\u{1D566}",
  "UpArrow;": "\u2191",
  "Uparrow;": "\u21D1",
  "uparrow;": "\u2191",
  "UpArrowBar;": "\u2912",
  "UpArrowDownArrow;": "\u21C5",
  "UpDownArrow;": "\u2195",
  "Updownarrow;": "\u21D5",
  "updownarrow;": "\u2195",
  "UpEquilibrium;": "\u296E",
  "upharpoonleft;": "\u21BF",
  "upharpoonright;": "\u21BE",
  "uplus;": "\u228E",
  "UpperLeftArrow;": "\u2196",
  "UpperRightArrow;": "\u2197",
  "Upsi;": "\u03D2",
  "upsi;": "\u03C5",
  "upsih;": "\u03D2",
  "Upsilon;": "\u03A5",
  "upsilon;": "\u03C5",
  "UpTee;": "\u22A5",
  "UpTeeArrow;": "\u21A5",
  "upuparrows;": "\u21C8",
  "urcorn;": "\u231D",
  "urcorner;": "\u231D",
  "urcrop;": "\u230E",
  "Uring;": "\u016E",
  "uring;": "\u016F",
  "urtri;": "\u25F9",
  "Uscr;": "\u{1D4B0}",
  "uscr;": "\u{1D4CA}",
  "utdot;": "\u22F0",
  "Utilde;": "\u0168",
  "utilde;": "\u0169",
  "utri;": "\u25B5",
  "utrif;": "\u25B4",
  "uuarr;": "\u21C8",
  "Uuml;": "\xDC",
  Uuml: Uuml$4,
  "uuml;": "\xFC",
  uuml: uuml$4,
  "uwangle;": "\u29A7",
  "vangrt;": "\u299C",
  "varepsilon;": "\u03F5",
  "varkappa;": "\u03F0",
  "varnothing;": "\u2205",
  "varphi;": "\u03D5",
  "varpi;": "\u03D6",
  "varpropto;": "\u221D",
  "vArr;": "\u21D5",
  "varr;": "\u2195",
  "varrho;": "\u03F1",
  "varsigma;": "\u03C2",
  "varsubsetneq;": "\u228A\uFE00",
  "varsubsetneqq;": "\u2ACB\uFE00",
  "varsupsetneq;": "\u228B\uFE00",
  "varsupsetneqq;": "\u2ACC\uFE00",
  "vartheta;": "\u03D1",
  "vartriangleleft;": "\u22B2",
  "vartriangleright;": "\u22B3",
  "Vbar;": "\u2AEB",
  "vBar;": "\u2AE8",
  "vBarv;": "\u2AE9",
  "Vcy;": "\u0412",
  "vcy;": "\u0432",
  "VDash;": "\u22AB",
  "Vdash;": "\u22A9",
  "vDash;": "\u22A8",
  "vdash;": "\u22A2",
  "Vdashl;": "\u2AE6",
  "Vee;": "\u22C1",
  "vee;": "\u2228",
  "veebar;": "\u22BB",
  "veeeq;": "\u225A",
  "vellip;": "\u22EE",
  "Verbar;": "\u2016",
  "verbar;": "|",
  "Vert;": "\u2016",
  "vert;": "|",
  "VerticalBar;": "\u2223",
  "VerticalLine;": "|",
  "VerticalSeparator;": "\u2758",
  "VerticalTilde;": "\u2240",
  "VeryThinSpace;": "\u200A",
  "Vfr;": "\u{1D519}",
  "vfr;": "\u{1D533}",
  "vltri;": "\u22B2",
  "vnsub;": "\u2282\u20D2",
  "vnsup;": "\u2283\u20D2",
  "Vopf;": "\u{1D54D}",
  "vopf;": "\u{1D567}",
  "vprop;": "\u221D",
  "vrtri;": "\u22B3",
  "Vscr;": "\u{1D4B1}",
  "vscr;": "\u{1D4CB}",
  "vsubnE;": "\u2ACB\uFE00",
  "vsubne;": "\u228A\uFE00",
  "vsupnE;": "\u2ACC\uFE00",
  "vsupne;": "\u228B\uFE00",
  "Vvdash;": "\u22AA",
  "vzigzag;": "\u299A",
  "Wcirc;": "\u0174",
  "wcirc;": "\u0175",
  "wedbar;": "\u2A5F",
  "Wedge;": "\u22C0",
  "wedge;": "\u2227",
  "wedgeq;": "\u2259",
  "weierp;": "\u2118",
  "Wfr;": "\u{1D51A}",
  "wfr;": "\u{1D534}",
  "Wopf;": "\u{1D54E}",
  "wopf;": "\u{1D568}",
  "wp;": "\u2118",
  "wr;": "\u2240",
  "wreath;": "\u2240",
  "Wscr;": "\u{1D4B2}",
  "wscr;": "\u{1D4CC}",
  "xcap;": "\u22C2",
  "xcirc;": "\u25EF",
  "xcup;": "\u22C3",
  "xdtri;": "\u25BD",
  "Xfr;": "\u{1D51B}",
  "xfr;": "\u{1D535}",
  "xhArr;": "\u27FA",
  "xharr;": "\u27F7",
  "Xi;": "\u039E",
  "xi;": "\u03BE",
  "xlArr;": "\u27F8",
  "xlarr;": "\u27F5",
  "xmap;": "\u27FC",
  "xnis;": "\u22FB",
  "xodot;": "\u2A00",
  "Xopf;": "\u{1D54F}",
  "xopf;": "\u{1D569}",
  "xoplus;": "\u2A01",
  "xotime;": "\u2A02",
  "xrArr;": "\u27F9",
  "xrarr;": "\u27F6",
  "Xscr;": "\u{1D4B3}",
  "xscr;": "\u{1D4CD}",
  "xsqcup;": "\u2A06",
  "xuplus;": "\u2A04",
  "xutri;": "\u25B3",
  "xvee;": "\u22C1",
  "xwedge;": "\u22C0",
  "Yacute;": "\xDD",
  Yacute: Yacute$4,
  "yacute;": "\xFD",
  yacute: yacute$4,
  "YAcy;": "\u042F",
  "yacy;": "\u044F",
  "Ycirc;": "\u0176",
  "ycirc;": "\u0177",
  "Ycy;": "\u042B",
  "ycy;": "\u044B",
  "yen;": "\xA5",
  yen: yen$4,
  "Yfr;": "\u{1D51C}",
  "yfr;": "\u{1D536}",
  "YIcy;": "\u0407",
  "yicy;": "\u0457",
  "Yopf;": "\u{1D550}",
  "yopf;": "\u{1D56A}",
  "Yscr;": "\u{1D4B4}",
  "yscr;": "\u{1D4CE}",
  "YUcy;": "\u042E",
  "yucy;": "\u044E",
  "Yuml;": "\u0178",
  "yuml;": "\xFF",
  yuml: yuml$4,
  "Zacute;": "\u0179",
  "zacute;": "\u017A",
  "Zcaron;": "\u017D",
  "zcaron;": "\u017E",
  "Zcy;": "\u0417",
  "zcy;": "\u0437",
  "Zdot;": "\u017B",
  "zdot;": "\u017C",
  "zeetrf;": "\u2128",
  "ZeroWidthSpace;": "\u200B",
  "Zeta;": "\u0396",
  "zeta;": "\u03B6",
  "Zfr;": "\u2128",
  "zfr;": "\u{1D537}",
  "ZHcy;": "\u0416",
  "zhcy;": "\u0436",
  "zigrarr;": "\u21DD",
  "Zopf;": "\u2124",
  "zopf;": "\u{1D56B}",
  "Zscr;": "\u{1D4B5}",
  "zscr;": "\u{1D4CF}",
  "zwj;": "\u200D",
  "zwnj;": "\u200C"
};
var punycode = punycode$2.exports;
var $encode = punycode.ucs2.encode;
var regexTest = safeRegexTest;
var callBound = callBound$3;
var $TypeError = type;
var entities = require$$4;
var endsInSemicolon = regexTest(/;$/);
var $replace = callBound("String.prototype.replace");
var $exec = callBound("RegExp.prototype.exec");
var $parseInt = parseInt;
var decode$3 = function decode(str) {
  if (typeof str !== "string") {
    throw new $TypeError("Expected a String");
  }
  return $replace(str, /&(#?[^;\W]+;?)/g, function(_, match) {
    var m = $exec(/^#(\d+);?$/, match);
    if (m) {
      return $encode([$parseInt(m[1], 10)]);
    }
    var m2 = $exec(/^#[Xx]([A-Fa-f0-9]+);?/, match);
    if (m2) {
      return $encode([$parseInt(m2[1], 16)]);
    }
    var hasSemi = endsInSemicolon(match);
    var withoutSemi = hasSemi ? $replace(match, /;$/, "") : match;
    var target2 = entities[withoutSemi] || hasSemi && entities[match];
    if (typeof target2 === "number") {
      return $encode([target2]);
    } else if (typeof target2 === "string") {
      return target2;
    }
    return "&" + match;
  });
};
ent.encode = encode$1;
ent.decode = decode$3;
var decode$2 = ent.decode;
var MUST_USE_ATTRIBUTE = 1;
var MUST_USE_PROPERTY = 2;
var HAS_BOOLEAN_VALUE = 8;
var HAS_NUMERIC_VALUE = 16;
var HAS_POSITIVE_NUMERIC_VALUE = 32 | 16;
var HAS_OVERLOADED_BOOLEAN_VALUE = 64;
function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}
var isCustomAttribute = RegExp.prototype.test.bind(
  /^(data|aria)-[a-z_][a-z\d_.\-]*$/
);
var HTMLDOMPropertyConfig = {
  Properties: {
    accept: null,
    acceptCharset: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    challenge: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    classID: MUST_USE_ATTRIBUTE,
    className: MUST_USE_ATTRIBUTE,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    coords: null,
    crossOrigin: null,
    data: null,
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formAction: MUST_USE_ATTRIBUTE,
    formEncType: MUST_USE_ATTRIBUTE,
    formMethod: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: MUST_USE_ATTRIBUTE,
    frameBorder: MUST_USE_ATTRIBUTE,
    headers: null,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    high: null,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    is: MUST_USE_ATTRIBUTE,
    keyParams: MUST_USE_ATTRIBUTE,
    keyType: MUST_USE_ATTRIBUTE,
    label: null,
    lang: null,
    list: MUST_USE_ATTRIBUTE,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    low: null,
    manifest: MUST_USE_ATTRIBUTE,
    marginHeight: null,
    marginWidth: null,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    media: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    minLength: MUST_USE_ATTRIBUTE,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    optimum: null,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scoped: HAS_BOOLEAN_VALUE,
    scrolling: null,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: null,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    sizes: MUST_USE_ATTRIBUTE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: MUST_USE_ATTRIBUTE,
    start: HAS_NUMERIC_VALUE,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    useMap: null,
    value: MUST_USE_PROPERTY,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,
    autoCapitalize: null,
    autoCorrect: null,
    itemProp: MUST_USE_ATTRIBUTE,
    itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    itemType: MUST_USE_ATTRIBUTE,
    itemID: MUST_USE_ATTRIBUTE,
    itemRef: MUST_USE_ATTRIBUTE,
    property: null,
    unselectable: MUST_USE_ATTRIBUTE
  }
};
var parseStyles = function(input) {
  var attributes = input.split(";");
  var styles = attributes.reduce(function(object, attribute) {
    var entry = attribute.split(/:(.+)/);
    if (entry[0] && entry[1]) {
      object[entry[0].trim()] = entry[1].trim();
    }
    return object;
  }, {});
  return styles;
};
var propertyToAttributeMapping = {
  "className": "class",
  "htmlFor": "for",
  "httpEquiv": "http-equiv",
  "acceptCharset": "accept-charset"
};
var propertyValueConversions = {
  "style": parseStyles,
  "placeholder": decode$2,
  "title": decode$2,
  "alt": decode$2
};
var getPropertyInfo = function() {
  var propInfoByAttributeName = {};
  Object.keys(HTMLDOMPropertyConfig.Properties).forEach(function(propName) {
    var propConfig = HTMLDOMPropertyConfig.Properties[propName];
    var attributeName = propertyToAttributeMapping[propName] || propName.toLowerCase();
    var propertyInfo = {
      attributeName,
      propertyName: propName,
      mustUseAttribute: checkMask(propConfig, MUST_USE_ATTRIBUTE),
      mustUseProperty: checkMask(propConfig, MUST_USE_PROPERTY),
      hasBooleanValue: checkMask(propConfig, HAS_BOOLEAN_VALUE),
      hasNumericValue: checkMask(propConfig, HAS_NUMERIC_VALUE),
      hasPositiveNumericValue: checkMask(propConfig, HAS_POSITIVE_NUMERIC_VALUE),
      hasOverloadedBooleanValue: checkMask(propConfig, HAS_OVERLOADED_BOOLEAN_VALUE)
    };
    propInfoByAttributeName[attributeName] = propertyInfo;
  });
  return function(attributeName) {
    return propInfoByAttributeName[attributeName];
  };
}();
var convertTagAttributes$1 = function(tag) {
  var attributes = tag.attribs;
  var vdomProperties = {
    attributes: {}
  };
  Object.keys(attributes).forEach(function(attributeName) {
    var lowerCased = attributeName.toLowerCase();
    var propInfo = getPropertyInfo(lowerCased);
    var value = attributes[attributeName];
    if (isCustomAttribute(attributeName) || !propInfo) {
      vdomProperties.attributes[attributeName] = value;
      return;
    }
    var valueConverter = propertyValueConversions[propInfo.propertyName];
    if (valueConverter) {
      value = valueConverter(value);
    }
    if (propInfo.mustUseAttribute) {
      if (propInfo.hasBooleanValue) {
        vdomProperties.attributes[propInfo.attributeName] = "";
      } else {
        vdomProperties.attributes[propInfo.attributeName] = value;
      }
    } else {
      var isTrue;
      if (propInfo.hasBooleanValue) {
        isTrue = value === "" || value.toLowerCase() === propInfo.attributeName;
        vdomProperties[propInfo.propertyName] = isTrue ? true : false;
      } else if (propInfo.hasOverloadedBooleanValue) {
        isTrue = value === "";
        vdomProperties[propInfo.propertyName] = isTrue ? true : value;
      } else if (propInfo.hasNumericValue || propInfo.hasPositiveNumericValue) {
        vdomProperties[propInfo.propertyName] = Number(value);
      } else {
        vdomProperties[propInfo.propertyName] = value;
      }
    }
  });
  return vdomProperties;
};
var convertTagAttributes_1 = convertTagAttributes$1;
var decode$1 = ent.decode;
var convertTagAttributes = convertTagAttributes_1;
var htmlparserToVdom = function createConverter(VNode2, VText2) {
  var converter = {
    convert: function(node2, getVNodeKey) {
      if (node2.type === "tag" || node2.type === "script" || node2.type === "style") {
        return converter.convertTag(node2, getVNodeKey);
      } else if (node2.type === "text") {
        return new VText2(decode$1(node2.data));
      } else {
        return new VText2("");
      }
    },
    convertTag: function(tag, getVNodeKey) {
      var attributes = convertTagAttributes(tag);
      var key;
      if (getVNodeKey) {
        key = getVNodeKey(attributes);
      }
      var children = Array.prototype.map.call(tag.children || [], function(node2) {
        return converter.convert(node2, getVNodeKey);
      });
      return new VNode2(tag.name, attributes, children, key);
    }
  };
  return converter;
};
var lib$2 = { exports: {} };
const require$$0$2 = {
  "0": 65533,
  "128": 8364,
  "130": 8218,
  "131": 402,
  "132": 8222,
  "133": 8230,
  "134": 8224,
  "135": 8225,
  "136": 710,
  "137": 8240,
  "138": 352,
  "139": 8249,
  "140": 338,
  "142": 381,
  "145": 8216,
  "146": 8217,
  "147": 8220,
  "148": 8221,
  "149": 8226,
  "150": 8211,
  "151": 8212,
  "152": 732,
  "153": 8482,
  "154": 353,
  "155": 8250,
  "156": 339,
  "158": 382,
  "159": 376
};
var decodeMap = require$$0$2;
var decode_codepoint$1 = decodeCodePoint$1;
function decodeCodePoint$1(codePoint) {
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return "\uFFFD";
  }
  if (codePoint in decodeMap) {
    codePoint = decodeMap[codePoint];
  }
  var output = "";
  if (codePoint > 65535) {
    codePoint -= 65536;
    output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
    codePoint = 56320 | codePoint & 1023;
  }
  output += String.fromCharCode(codePoint);
  return output;
}
const Aacute$3 = "\xC1";
const aacute$3 = "\xE1";
const Abreve$1 = "\u0102";
const abreve$1 = "\u0103";
const ac$1 = "\u223E";
const acd$1 = "\u223F";
const acE$1 = "\u223E\u0333";
const Acirc$3 = "\xC2";
const acirc$3 = "\xE2";
const acute$3 = "\xB4";
const Acy$1 = "\u0410";
const acy$1 = "\u0430";
const AElig$3 = "\xC6";
const aelig$3 = "\xE6";
const af$1 = "\u2061";
const Afr$1 = "\u{1D504}";
const afr$1 = "\u{1D51E}";
const Agrave$3 = "\xC0";
const agrave$3 = "\xE0";
const alefsym$1 = "\u2135";
const aleph$1 = "\u2135";
const Alpha$1 = "\u0391";
const alpha$1 = "\u03B1";
const Amacr$1 = "\u0100";
const amacr$1 = "\u0101";
const amalg$1 = "\u2A3F";
const amp$5 = "&";
const AMP$3 = "&";
const andand$1 = "\u2A55";
const And$1 = "\u2A53";
const and$1 = "\u2227";
const andd$1 = "\u2A5C";
const andslope$1 = "\u2A58";
const andv$1 = "\u2A5A";
const ang$1 = "\u2220";
const ange$1 = "\u29A4";
const angle$1 = "\u2220";
const angmsdaa$1 = "\u29A8";
const angmsdab$1 = "\u29A9";
const angmsdac$1 = "\u29AA";
const angmsdad$1 = "\u29AB";
const angmsdae$1 = "\u29AC";
const angmsdaf$1 = "\u29AD";
const angmsdag$1 = "\u29AE";
const angmsdah$1 = "\u29AF";
const angmsd$1 = "\u2221";
const angrt$1 = "\u221F";
const angrtvb$1 = "\u22BE";
const angrtvbd$1 = "\u299D";
const angsph$1 = "\u2222";
const angst$1 = "\xC5";
const angzarr$1 = "\u237C";
const Aogon$1 = "\u0104";
const aogon$1 = "\u0105";
const Aopf$1 = "\u{1D538}";
const aopf$1 = "\u{1D552}";
const apacir$1 = "\u2A6F";
const ap$1 = "\u2248";
const apE$1 = "\u2A70";
const ape$1 = "\u224A";
const apid$1 = "\u224B";
const apos$3 = "'";
const ApplyFunction$1 = "\u2061";
const approx$1 = "\u2248";
const approxeq$1 = "\u224A";
const Aring$3 = "\xC5";
const aring$3 = "\xE5";
const Ascr$1 = "\u{1D49C}";
const ascr$1 = "\u{1D4B6}";
const Assign$1 = "\u2254";
const ast$1 = "*";
const asymp$1 = "\u2248";
const asympeq$1 = "\u224D";
const Atilde$3 = "\xC3";
const atilde$3 = "\xE3";
const Auml$3 = "\xC4";
const auml$3 = "\xE4";
const awconint$1 = "\u2233";
const awint$1 = "\u2A11";
const backcong$1 = "\u224C";
const backepsilon$1 = "\u03F6";
const backprime$1 = "\u2035";
const backsim$1 = "\u223D";
const backsimeq$1 = "\u22CD";
const Backslash$1 = "\u2216";
const Barv$1 = "\u2AE7";
const barvee$1 = "\u22BD";
const barwed$1 = "\u2305";
const Barwed$1 = "\u2306";
const barwedge$1 = "\u2305";
const bbrk$1 = "\u23B5";
const bbrktbrk$1 = "\u23B6";
const bcong$1 = "\u224C";
const Bcy$1 = "\u0411";
const bcy$1 = "\u0431";
const bdquo$1 = "\u201E";
const becaus$1 = "\u2235";
const because$1 = "\u2235";
const Because$1 = "\u2235";
const bemptyv$1 = "\u29B0";
const bepsi$1 = "\u03F6";
const bernou$1 = "\u212C";
const Bernoullis$1 = "\u212C";
const Beta$1 = "\u0392";
const beta$1 = "\u03B2";
const beth$1 = "\u2136";
const between$1 = "\u226C";
const Bfr$1 = "\u{1D505}";
const bfr$1 = "\u{1D51F}";
const bigcap$1 = "\u22C2";
const bigcirc$1 = "\u25EF";
const bigcup$1 = "\u22C3";
const bigodot$1 = "\u2A00";
const bigoplus$1 = "\u2A01";
const bigotimes$1 = "\u2A02";
const bigsqcup$1 = "\u2A06";
const bigstar$1 = "\u2605";
const bigtriangledown$1 = "\u25BD";
const bigtriangleup$1 = "\u25B3";
const biguplus$1 = "\u2A04";
const bigvee$1 = "\u22C1";
const bigwedge$1 = "\u22C0";
const bkarow$1 = "\u290D";
const blacklozenge$1 = "\u29EB";
const blacksquare$1 = "\u25AA";
const blacktriangle$1 = "\u25B4";
const blacktriangledown$1 = "\u25BE";
const blacktriangleleft$1 = "\u25C2";
const blacktriangleright$1 = "\u25B8";
const blank$1 = "\u2423";
const blk12$1 = "\u2592";
const blk14$1 = "\u2591";
const blk34$1 = "\u2593";
const block$1 = "\u2588";
const bne$1 = "=\u20E5";
const bnequiv$1 = "\u2261\u20E5";
const bNot$1 = "\u2AED";
const bnot$1 = "\u2310";
const Bopf$1 = "\u{1D539}";
const bopf$1 = "\u{1D553}";
const bot$1 = "\u22A5";
const bottom$1 = "\u22A5";
const bowtie$1 = "\u22C8";
const boxbox$1 = "\u29C9";
const boxdl$1 = "\u2510";
const boxdL$1 = "\u2555";
const boxDl$1 = "\u2556";
const boxDL$1 = "\u2557";
const boxdr$1 = "\u250C";
const boxdR$1 = "\u2552";
const boxDr$1 = "\u2553";
const boxDR$1 = "\u2554";
const boxh$1 = "\u2500";
const boxH$1 = "\u2550";
const boxhd$1 = "\u252C";
const boxHd$1 = "\u2564";
const boxhD$1 = "\u2565";
const boxHD$1 = "\u2566";
const boxhu$1 = "\u2534";
const boxHu$1 = "\u2567";
const boxhU$1 = "\u2568";
const boxHU$1 = "\u2569";
const boxminus$1 = "\u229F";
const boxplus$1 = "\u229E";
const boxtimes$1 = "\u22A0";
const boxul$1 = "\u2518";
const boxuL$1 = "\u255B";
const boxUl$1 = "\u255C";
const boxUL$1 = "\u255D";
const boxur$1 = "\u2514";
const boxuR$1 = "\u2558";
const boxUr$1 = "\u2559";
const boxUR$1 = "\u255A";
const boxv$1 = "\u2502";
const boxV$1 = "\u2551";
const boxvh$1 = "\u253C";
const boxvH$1 = "\u256A";
const boxVh$1 = "\u256B";
const boxVH$1 = "\u256C";
const boxvl$1 = "\u2524";
const boxvL$1 = "\u2561";
const boxVl$1 = "\u2562";
const boxVL$1 = "\u2563";
const boxvr$1 = "\u251C";
const boxvR$1 = "\u255E";
const boxVr$1 = "\u255F";
const boxVR$1 = "\u2560";
const bprime$1 = "\u2035";
const breve$1 = "\u02D8";
const Breve$1 = "\u02D8";
const brvbar$3 = "\xA6";
const bscr$1 = "\u{1D4B7}";
const Bscr$1 = "\u212C";
const bsemi$1 = "\u204F";
const bsim$1 = "\u223D";
const bsime$1 = "\u22CD";
const bsolb$1 = "\u29C5";
const bsol$1 = "\\";
const bsolhsub$1 = "\u27C8";
const bull$1 = "\u2022";
const bullet$1 = "\u2022";
const bump$1 = "\u224E";
const bumpE$1 = "\u2AAE";
const bumpe$1 = "\u224F";
const Bumpeq$1 = "\u224E";
const bumpeq$1 = "\u224F";
const Cacute$1 = "\u0106";
const cacute$1 = "\u0107";
const capand$1 = "\u2A44";
const capbrcup$1 = "\u2A49";
const capcap$1 = "\u2A4B";
const cap$1 = "\u2229";
const Cap$1 = "\u22D2";
const capcup$1 = "\u2A47";
const capdot$1 = "\u2A40";
const CapitalDifferentialD$1 = "\u2145";
const caps$1 = "\u2229\uFE00";
const caret$1 = "\u2041";
const caron$1 = "\u02C7";
const Cayleys$1 = "\u212D";
const ccaps$1 = "\u2A4D";
const Ccaron$1 = "\u010C";
const ccaron$1 = "\u010D";
const Ccedil$3 = "\xC7";
const ccedil$3 = "\xE7";
const Ccirc$1 = "\u0108";
const ccirc$1 = "\u0109";
const Cconint$1 = "\u2230";
const ccups$1 = "\u2A4C";
const ccupssm$1 = "\u2A50";
const Cdot$1 = "\u010A";
const cdot$1 = "\u010B";
const cedil$3 = "\xB8";
const Cedilla$1 = "\xB8";
const cemptyv$1 = "\u29B2";
const cent$3 = "\xA2";
const centerdot$1 = "\xB7";
const CenterDot$1 = "\xB7";
const cfr$1 = "\u{1D520}";
const Cfr$1 = "\u212D";
const CHcy$1 = "\u0427";
const chcy$1 = "\u0447";
const check$1 = "\u2713";
const checkmark$1 = "\u2713";
const Chi$1 = "\u03A7";
const chi$1 = "\u03C7";
const circ$1 = "\u02C6";
const circeq$1 = "\u2257";
const circlearrowleft$1 = "\u21BA";
const circlearrowright$1 = "\u21BB";
const circledast$1 = "\u229B";
const circledcirc$1 = "\u229A";
const circleddash$1 = "\u229D";
const CircleDot$1 = "\u2299";
const circledR$1 = "\xAE";
const circledS$1 = "\u24C8";
const CircleMinus$1 = "\u2296";
const CirclePlus$1 = "\u2295";
const CircleTimes$1 = "\u2297";
const cir$1 = "\u25CB";
const cirE$1 = "\u29C3";
const cire$1 = "\u2257";
const cirfnint$1 = "\u2A10";
const cirmid$1 = "\u2AEF";
const cirscir$1 = "\u29C2";
const ClockwiseContourIntegral$1 = "\u2232";
const CloseCurlyDoubleQuote$1 = "\u201D";
const CloseCurlyQuote$1 = "\u2019";
const clubs$1 = "\u2663";
const clubsuit$1 = "\u2663";
const colon$1 = ":";
const Colon$1 = "\u2237";
const Colone$1 = "\u2A74";
const colone$1 = "\u2254";
const coloneq$1 = "\u2254";
const comma$1 = ",";
const commat$1 = "@";
const comp$1 = "\u2201";
const compfn$1 = "\u2218";
const complement$1 = "\u2201";
const complexes$1 = "\u2102";
const cong$1 = "\u2245";
const congdot$1 = "\u2A6D";
const Congruent$1 = "\u2261";
const conint$1 = "\u222E";
const Conint$1 = "\u222F";
const ContourIntegral$1 = "\u222E";
const copf$1 = "\u{1D554}";
const Copf$1 = "\u2102";
const coprod$1 = "\u2210";
const Coproduct$1 = "\u2210";
const copy$3 = "\xA9";
const COPY$3 = "\xA9";
const copysr$1 = "\u2117";
const CounterClockwiseContourIntegral$1 = "\u2233";
const crarr$1 = "\u21B5";
const cross$1 = "\u2717";
const Cross$1 = "\u2A2F";
const Cscr$1 = "\u{1D49E}";
const cscr$1 = "\u{1D4B8}";
const csub$1 = "\u2ACF";
const csube$1 = "\u2AD1";
const csup$1 = "\u2AD0";
const csupe$1 = "\u2AD2";
const ctdot$1 = "\u22EF";
const cudarrl$1 = "\u2938";
const cudarrr$1 = "\u2935";
const cuepr$1 = "\u22DE";
const cuesc$1 = "\u22DF";
const cularr$1 = "\u21B6";
const cularrp$1 = "\u293D";
const cupbrcap$1 = "\u2A48";
const cupcap$1 = "\u2A46";
const CupCap$1 = "\u224D";
const cup$1 = "\u222A";
const Cup$1 = "\u22D3";
const cupcup$1 = "\u2A4A";
const cupdot$1 = "\u228D";
const cupor$1 = "\u2A45";
const cups$1 = "\u222A\uFE00";
const curarr$1 = "\u21B7";
const curarrm$1 = "\u293C";
const curlyeqprec$1 = "\u22DE";
const curlyeqsucc$1 = "\u22DF";
const curlyvee$1 = "\u22CE";
const curlywedge$1 = "\u22CF";
const curren$3 = "\xA4";
const curvearrowleft$1 = "\u21B6";
const curvearrowright$1 = "\u21B7";
const cuvee$1 = "\u22CE";
const cuwed$1 = "\u22CF";
const cwconint$1 = "\u2232";
const cwint$1 = "\u2231";
const cylcty$1 = "\u232D";
const dagger$1 = "\u2020";
const Dagger$1 = "\u2021";
const daleth$1 = "\u2138";
const darr$1 = "\u2193";
const Darr$1 = "\u21A1";
const dArr$1 = "\u21D3";
const dash$1 = "\u2010";
const Dashv$1 = "\u2AE4";
const dashv$1 = "\u22A3";
const dbkarow$1 = "\u290F";
const dblac$1 = "\u02DD";
const Dcaron$1 = "\u010E";
const dcaron$1 = "\u010F";
const Dcy$1 = "\u0414";
const dcy$1 = "\u0434";
const ddagger$1 = "\u2021";
const ddarr$1 = "\u21CA";
const DD$1 = "\u2145";
const dd$1 = "\u2146";
const DDotrahd$1 = "\u2911";
const ddotseq$1 = "\u2A77";
const deg$3 = "\xB0";
const Del$1 = "\u2207";
const Delta$1 = "\u0394";
const delta$1 = "\u03B4";
const demptyv$1 = "\u29B1";
const dfisht$1 = "\u297F";
const Dfr$1 = "\u{1D507}";
const dfr$1 = "\u{1D521}";
const dHar$1 = "\u2965";
const dharl$1 = "\u21C3";
const dharr$1 = "\u21C2";
const DiacriticalAcute$1 = "\xB4";
const DiacriticalDot$1 = "\u02D9";
const DiacriticalDoubleAcute$1 = "\u02DD";
const DiacriticalGrave$1 = "`";
const DiacriticalTilde$1 = "\u02DC";
const diam$1 = "\u22C4";
const diamond$1 = "\u22C4";
const Diamond$1 = "\u22C4";
const diamondsuit$1 = "\u2666";
const diams$1 = "\u2666";
const die$1 = "\xA8";
const DifferentialD$1 = "\u2146";
const digamma$1 = "\u03DD";
const disin$1 = "\u22F2";
const div$1 = "\xF7";
const divide$3 = "\xF7";
const divideontimes$1 = "\u22C7";
const divonx$1 = "\u22C7";
const DJcy$1 = "\u0402";
const djcy$1 = "\u0452";
const dlcorn$1 = "\u231E";
const dlcrop$1 = "\u230D";
const dollar$1 = "$";
const Dopf$1 = "\u{1D53B}";
const dopf$1 = "\u{1D555}";
const Dot$1 = "\xA8";
const dot$1 = "\u02D9";
const DotDot$1 = "\u20DC";
const doteq$1 = "\u2250";
const doteqdot$1 = "\u2251";
const DotEqual$1 = "\u2250";
const dotminus$1 = "\u2238";
const dotplus$1 = "\u2214";
const dotsquare$1 = "\u22A1";
const doublebarwedge$1 = "\u2306";
const DoubleContourIntegral$1 = "\u222F";
const DoubleDot$1 = "\xA8";
const DoubleDownArrow$1 = "\u21D3";
const DoubleLeftArrow$1 = "\u21D0";
const DoubleLeftRightArrow$1 = "\u21D4";
const DoubleLeftTee$1 = "\u2AE4";
const DoubleLongLeftArrow$1 = "\u27F8";
const DoubleLongLeftRightArrow$1 = "\u27FA";
const DoubleLongRightArrow$1 = "\u27F9";
const DoubleRightArrow$1 = "\u21D2";
const DoubleRightTee$1 = "\u22A8";
const DoubleUpArrow$1 = "\u21D1";
const DoubleUpDownArrow$1 = "\u21D5";
const DoubleVerticalBar$1 = "\u2225";
const DownArrowBar$1 = "\u2913";
const downarrow$1 = "\u2193";
const DownArrow$1 = "\u2193";
const Downarrow$1 = "\u21D3";
const DownArrowUpArrow$1 = "\u21F5";
const DownBreve$1 = "\u0311";
const downdownarrows$1 = "\u21CA";
const downharpoonleft$1 = "\u21C3";
const downharpoonright$1 = "\u21C2";
const DownLeftRightVector$1 = "\u2950";
const DownLeftTeeVector$1 = "\u295E";
const DownLeftVectorBar$1 = "\u2956";
const DownLeftVector$1 = "\u21BD";
const DownRightTeeVector$1 = "\u295F";
const DownRightVectorBar$1 = "\u2957";
const DownRightVector$1 = "\u21C1";
const DownTeeArrow$1 = "\u21A7";
const DownTee$1 = "\u22A4";
const drbkarow$1 = "\u2910";
const drcorn$1 = "\u231F";
const drcrop$1 = "\u230C";
const Dscr$1 = "\u{1D49F}";
const dscr$1 = "\u{1D4B9}";
const DScy$1 = "\u0405";
const dscy$1 = "\u0455";
const dsol$1 = "\u29F6";
const Dstrok$1 = "\u0110";
const dstrok$1 = "\u0111";
const dtdot$1 = "\u22F1";
const dtri$1 = "\u25BF";
const dtrif$1 = "\u25BE";
const duarr$1 = "\u21F5";
const duhar$1 = "\u296F";
const dwangle$1 = "\u29A6";
const DZcy$1 = "\u040F";
const dzcy$1 = "\u045F";
const dzigrarr$1 = "\u27FF";
const Eacute$3 = "\xC9";
const eacute$3 = "\xE9";
const easter$1 = "\u2A6E";
const Ecaron$1 = "\u011A";
const ecaron$1 = "\u011B";
const Ecirc$3 = "\xCA";
const ecirc$3 = "\xEA";
const ecir$1 = "\u2256";
const ecolon$1 = "\u2255";
const Ecy$1 = "\u042D";
const ecy$1 = "\u044D";
const eDDot$1 = "\u2A77";
const Edot$1 = "\u0116";
const edot$1 = "\u0117";
const eDot$1 = "\u2251";
const ee$1 = "\u2147";
const efDot$1 = "\u2252";
const Efr$1 = "\u{1D508}";
const efr$1 = "\u{1D522}";
const eg$1 = "\u2A9A";
const Egrave$3 = "\xC8";
const egrave$3 = "\xE8";
const egs$1 = "\u2A96";
const egsdot$1 = "\u2A98";
const el$1 = "\u2A99";
const Element$1 = "\u2208";
const elinters$1 = "\u23E7";
const ell$1 = "\u2113";
const els$1 = "\u2A95";
const elsdot$1 = "\u2A97";
const Emacr$1 = "\u0112";
const emacr$1 = "\u0113";
const empty$1 = "\u2205";
const emptyset$1 = "\u2205";
const EmptySmallSquare$1 = "\u25FB";
const emptyv$1 = "\u2205";
const EmptyVerySmallSquare$1 = "\u25AB";
const emsp13$1 = "\u2004";
const emsp14$1 = "\u2005";
const emsp$1 = "\u2003";
const ENG$1 = "\u014A";
const eng$1 = "\u014B";
const ensp$1 = "\u2002";
const Eogon$1 = "\u0118";
const eogon$1 = "\u0119";
const Eopf$1 = "\u{1D53C}";
const eopf$1 = "\u{1D556}";
const epar$1 = "\u22D5";
const eparsl$1 = "\u29E3";
const eplus$1 = "\u2A71";
const epsi$1 = "\u03B5";
const Epsilon$1 = "\u0395";
const epsilon$1 = "\u03B5";
const epsiv$1 = "\u03F5";
const eqcirc$1 = "\u2256";
const eqcolon$1 = "\u2255";
const eqsim$1 = "\u2242";
const eqslantgtr$1 = "\u2A96";
const eqslantless$1 = "\u2A95";
const Equal$1 = "\u2A75";
const equals$1 = "=";
const EqualTilde$1 = "\u2242";
const equest$1 = "\u225F";
const Equilibrium$1 = "\u21CC";
const equiv$1 = "\u2261";
const equivDD$1 = "\u2A78";
const eqvparsl$1 = "\u29E5";
const erarr$1 = "\u2971";
const erDot$1 = "\u2253";
const escr$1 = "\u212F";
const Escr$1 = "\u2130";
const esdot$1 = "\u2250";
const Esim$1 = "\u2A73";
const esim$1 = "\u2242";
const Eta$1 = "\u0397";
const eta$1 = "\u03B7";
const ETH$3 = "\xD0";
const eth$3 = "\xF0";
const Euml$3 = "\xCB";
const euml$3 = "\xEB";
const euro$1 = "\u20AC";
const excl$1 = "!";
const exist$1 = "\u2203";
const Exists$1 = "\u2203";
const expectation$1 = "\u2130";
const exponentiale$1 = "\u2147";
const ExponentialE$1 = "\u2147";
const fallingdotseq$1 = "\u2252";
const Fcy$1 = "\u0424";
const fcy$1 = "\u0444";
const female$1 = "\u2640";
const ffilig$1 = "\uFB03";
const fflig$1 = "\uFB00";
const ffllig$1 = "\uFB04";
const Ffr$1 = "\u{1D509}";
const ffr$1 = "\u{1D523}";
const filig$1 = "\uFB01";
const FilledSmallSquare$1 = "\u25FC";
const FilledVerySmallSquare$1 = "\u25AA";
const fjlig$1 = "fj";
const flat$1 = "\u266D";
const fllig$1 = "\uFB02";
const fltns$1 = "\u25B1";
const fnof$1 = "\u0192";
const Fopf$1 = "\u{1D53D}";
const fopf$1 = "\u{1D557}";
const forall$1 = "\u2200";
const ForAll$1 = "\u2200";
const fork$1 = "\u22D4";
const forkv$1 = "\u2AD9";
const Fouriertrf$1 = "\u2131";
const fpartint$1 = "\u2A0D";
const frac12$3 = "\xBD";
const frac13$1 = "\u2153";
const frac14$3 = "\xBC";
const frac15$1 = "\u2155";
const frac16$1 = "\u2159";
const frac18$1 = "\u215B";
const frac23$1 = "\u2154";
const frac25$1 = "\u2156";
const frac34$3 = "\xBE";
const frac35$1 = "\u2157";
const frac38$1 = "\u215C";
const frac45$1 = "\u2158";
const frac56$1 = "\u215A";
const frac58$1 = "\u215D";
const frac78$1 = "\u215E";
const frasl$1 = "\u2044";
const frown$1 = "\u2322";
const fscr$1 = "\u{1D4BB}";
const Fscr$1 = "\u2131";
const gacute$1 = "\u01F5";
const Gamma$1 = "\u0393";
const gamma$1 = "\u03B3";
const Gammad$1 = "\u03DC";
const gammad$1 = "\u03DD";
const gap$1 = "\u2A86";
const Gbreve$1 = "\u011E";
const gbreve$1 = "\u011F";
const Gcedil$1 = "\u0122";
const Gcirc$1 = "\u011C";
const gcirc$1 = "\u011D";
const Gcy$1 = "\u0413";
const gcy$1 = "\u0433";
const Gdot$1 = "\u0120";
const gdot$1 = "\u0121";
const ge$1 = "\u2265";
const gE$1 = "\u2267";
const gEl$1 = "\u2A8C";
const gel$1 = "\u22DB";
const geq$1 = "\u2265";
const geqq$1 = "\u2267";
const geqslant$1 = "\u2A7E";
const gescc$1 = "\u2AA9";
const ges$1 = "\u2A7E";
const gesdot$1 = "\u2A80";
const gesdoto$1 = "\u2A82";
const gesdotol$1 = "\u2A84";
const gesl$1 = "\u22DB\uFE00";
const gesles$1 = "\u2A94";
const Gfr$1 = "\u{1D50A}";
const gfr$1 = "\u{1D524}";
const gg$1 = "\u226B";
const Gg$1 = "\u22D9";
const ggg$1 = "\u22D9";
const gimel$1 = "\u2137";
const GJcy$1 = "\u0403";
const gjcy$1 = "\u0453";
const gla$1 = "\u2AA5";
const gl$1 = "\u2277";
const glE$1 = "\u2A92";
const glj$1 = "\u2AA4";
const gnap$1 = "\u2A8A";
const gnapprox$1 = "\u2A8A";
const gne$1 = "\u2A88";
const gnE$1 = "\u2269";
const gneq$1 = "\u2A88";
const gneqq$1 = "\u2269";
const gnsim$1 = "\u22E7";
const Gopf$1 = "\u{1D53E}";
const gopf$1 = "\u{1D558}";
const grave$1 = "`";
const GreaterEqual$1 = "\u2265";
const GreaterEqualLess$1 = "\u22DB";
const GreaterFullEqual$1 = "\u2267";
const GreaterGreater$1 = "\u2AA2";
const GreaterLess$1 = "\u2277";
const GreaterSlantEqual$1 = "\u2A7E";
const GreaterTilde$1 = "\u2273";
const Gscr$1 = "\u{1D4A2}";
const gscr$1 = "\u210A";
const gsim$1 = "\u2273";
const gsime$1 = "\u2A8E";
const gsiml$1 = "\u2A90";
const gtcc$1 = "\u2AA7";
const gtcir$1 = "\u2A7A";
const gt$5 = ">";
const GT$3 = ">";
const Gt$1 = "\u226B";
const gtdot$1 = "\u22D7";
const gtlPar$1 = "\u2995";
const gtquest$1 = "\u2A7C";
const gtrapprox$1 = "\u2A86";
const gtrarr$1 = "\u2978";
const gtrdot$1 = "\u22D7";
const gtreqless$1 = "\u22DB";
const gtreqqless$1 = "\u2A8C";
const gtrless$1 = "\u2277";
const gtrsim$1 = "\u2273";
const gvertneqq$1 = "\u2269\uFE00";
const gvnE$1 = "\u2269\uFE00";
const Hacek$1 = "\u02C7";
const hairsp$1 = "\u200A";
const half$1 = "\xBD";
const hamilt$1 = "\u210B";
const HARDcy$1 = "\u042A";
const hardcy$1 = "\u044A";
const harrcir$1 = "\u2948";
const harr$1 = "\u2194";
const hArr$1 = "\u21D4";
const harrw$1 = "\u21AD";
const Hat$1 = "^";
const hbar$1 = "\u210F";
const Hcirc$1 = "\u0124";
const hcirc$1 = "\u0125";
const hearts$1 = "\u2665";
const heartsuit$1 = "\u2665";
const hellip$1 = "\u2026";
const hercon$1 = "\u22B9";
const hfr$1 = "\u{1D525}";
const Hfr$1 = "\u210C";
const HilbertSpace$1 = "\u210B";
const hksearow$1 = "\u2925";
const hkswarow$1 = "\u2926";
const hoarr$1 = "\u21FF";
const homtht$1 = "\u223B";
const hookleftarrow$1 = "\u21A9";
const hookrightarrow$1 = "\u21AA";
const hopf$1 = "\u{1D559}";
const Hopf$1 = "\u210D";
const horbar$1 = "\u2015";
const HorizontalLine$1 = "\u2500";
const hscr$1 = "\u{1D4BD}";
const Hscr$1 = "\u210B";
const hslash$1 = "\u210F";
const Hstrok$1 = "\u0126";
const hstrok$1 = "\u0127";
const HumpDownHump$1 = "\u224E";
const HumpEqual$1 = "\u224F";
const hybull$1 = "\u2043";
const hyphen$1 = "\u2010";
const Iacute$3 = "\xCD";
const iacute$3 = "\xED";
const ic$1 = "\u2063";
const Icirc$3 = "\xCE";
const icirc$3 = "\xEE";
const Icy$1 = "\u0418";
const icy$1 = "\u0438";
const Idot$1 = "\u0130";
const IEcy$1 = "\u0415";
const iecy$1 = "\u0435";
const iexcl$3 = "\xA1";
const iff$1 = "\u21D4";
const ifr$1 = "\u{1D526}";
const Ifr$1 = "\u2111";
const Igrave$3 = "\xCC";
const igrave$3 = "\xEC";
const ii$1 = "\u2148";
const iiiint$1 = "\u2A0C";
const iiint$1 = "\u222D";
const iinfin$1 = "\u29DC";
const iiota$1 = "\u2129";
const IJlig$1 = "\u0132";
const ijlig$1 = "\u0133";
const Imacr$1 = "\u012A";
const imacr$1 = "\u012B";
const image$1 = "\u2111";
const ImaginaryI$1 = "\u2148";
const imagline$1 = "\u2110";
const imagpart$1 = "\u2111";
const imath$1 = "\u0131";
const Im$1 = "\u2111";
const imof$1 = "\u22B7";
const imped$1 = "\u01B5";
const Implies$1 = "\u21D2";
const incare$1 = "\u2105";
const infin$1 = "\u221E";
const infintie$1 = "\u29DD";
const inodot$1 = "\u0131";
const intcal$1 = "\u22BA";
const int$1 = "\u222B";
const Int$1 = "\u222C";
const integers$1 = "\u2124";
const Integral$1 = "\u222B";
const intercal$1 = "\u22BA";
const Intersection$1 = "\u22C2";
const intlarhk$1 = "\u2A17";
const intprod$1 = "\u2A3C";
const InvisibleComma$1 = "\u2063";
const InvisibleTimes$1 = "\u2062";
const IOcy$1 = "\u0401";
const iocy$1 = "\u0451";
const Iogon$1 = "\u012E";
const iogon$1 = "\u012F";
const Iopf$1 = "\u{1D540}";
const iopf$1 = "\u{1D55A}";
const Iota$1 = "\u0399";
const iota$1 = "\u03B9";
const iprod$1 = "\u2A3C";
const iquest$3 = "\xBF";
const iscr$1 = "\u{1D4BE}";
const Iscr$1 = "\u2110";
const isin$1 = "\u2208";
const isindot$1 = "\u22F5";
const isinE$1 = "\u22F9";
const isins$1 = "\u22F4";
const isinsv$1 = "\u22F3";
const isinv$1 = "\u2208";
const it$1 = "\u2062";
const Itilde$1 = "\u0128";
const itilde$1 = "\u0129";
const Iukcy$1 = "\u0406";
const iukcy$1 = "\u0456";
const Iuml$3 = "\xCF";
const iuml$3 = "\xEF";
const Jcirc$1 = "\u0134";
const jcirc$1 = "\u0135";
const Jcy$1 = "\u0419";
const jcy$1 = "\u0439";
const Jfr$1 = "\u{1D50D}";
const jfr$1 = "\u{1D527}";
const jmath$1 = "\u0237";
const Jopf$1 = "\u{1D541}";
const jopf$1 = "\u{1D55B}";
const Jscr$1 = "\u{1D4A5}";
const jscr$1 = "\u{1D4BF}";
const Jsercy$1 = "\u0408";
const jsercy$1 = "\u0458";
const Jukcy$1 = "\u0404";
const jukcy$1 = "\u0454";
const Kappa$1 = "\u039A";
const kappa$1 = "\u03BA";
const kappav$1 = "\u03F0";
const Kcedil$1 = "\u0136";
const kcedil$1 = "\u0137";
const Kcy$1 = "\u041A";
const kcy$1 = "\u043A";
const Kfr$1 = "\u{1D50E}";
const kfr$1 = "\u{1D528}";
const kgreen$1 = "\u0138";
const KHcy$1 = "\u0425";
const khcy$1 = "\u0445";
const KJcy$1 = "\u040C";
const kjcy$1 = "\u045C";
const Kopf$1 = "\u{1D542}";
const kopf$1 = "\u{1D55C}";
const Kscr$1 = "\u{1D4A6}";
const kscr$1 = "\u{1D4C0}";
const lAarr$1 = "\u21DA";
const Lacute$1 = "\u0139";
const lacute$1 = "\u013A";
const laemptyv$1 = "\u29B4";
const lagran$1 = "\u2112";
const Lambda$1 = "\u039B";
const lambda$1 = "\u03BB";
const lang$1 = "\u27E8";
const Lang$1 = "\u27EA";
const langd$1 = "\u2991";
const langle$1 = "\u27E8";
const lap$1 = "\u2A85";
const Laplacetrf$1 = "\u2112";
const laquo$3 = "\xAB";
const larrb$1 = "\u21E4";
const larrbfs$1 = "\u291F";
const larr$1 = "\u2190";
const Larr$1 = "\u219E";
const lArr$1 = "\u21D0";
const larrfs$1 = "\u291D";
const larrhk$1 = "\u21A9";
const larrlp$1 = "\u21AB";
const larrpl$1 = "\u2939";
const larrsim$1 = "\u2973";
const larrtl$1 = "\u21A2";
const latail$1 = "\u2919";
const lAtail$1 = "\u291B";
const lat$1 = "\u2AAB";
const late$1 = "\u2AAD";
const lates$1 = "\u2AAD\uFE00";
const lbarr$1 = "\u290C";
const lBarr$1 = "\u290E";
const lbbrk$1 = "\u2772";
const lbrace$1 = "{";
const lbrack$1 = "[";
const lbrke$1 = "\u298B";
const lbrksld$1 = "\u298F";
const lbrkslu$1 = "\u298D";
const Lcaron$1 = "\u013D";
const lcaron$1 = "\u013E";
const Lcedil$1 = "\u013B";
const lcedil$1 = "\u013C";
const lceil$1 = "\u2308";
const lcub$1 = "{";
const Lcy$1 = "\u041B";
const lcy$1 = "\u043B";
const ldca$1 = "\u2936";
const ldquo$1 = "\u201C";
const ldquor$1 = "\u201E";
const ldrdhar$1 = "\u2967";
const ldrushar$1 = "\u294B";
const ldsh$1 = "\u21B2";
const le$1 = "\u2264";
const lE$1 = "\u2266";
const LeftAngleBracket$1 = "\u27E8";
const LeftArrowBar$1 = "\u21E4";
const leftarrow$1 = "\u2190";
const LeftArrow$1 = "\u2190";
const Leftarrow$1 = "\u21D0";
const LeftArrowRightArrow$1 = "\u21C6";
const leftarrowtail$1 = "\u21A2";
const LeftCeiling$1 = "\u2308";
const LeftDoubleBracket$1 = "\u27E6";
const LeftDownTeeVector$1 = "\u2961";
const LeftDownVectorBar$1 = "\u2959";
const LeftDownVector$1 = "\u21C3";
const LeftFloor$1 = "\u230A";
const leftharpoondown$1 = "\u21BD";
const leftharpoonup$1 = "\u21BC";
const leftleftarrows$1 = "\u21C7";
const leftrightarrow$1 = "\u2194";
const LeftRightArrow$1 = "\u2194";
const Leftrightarrow$1 = "\u21D4";
const leftrightarrows$1 = "\u21C6";
const leftrightharpoons$1 = "\u21CB";
const leftrightsquigarrow$1 = "\u21AD";
const LeftRightVector$1 = "\u294E";
const LeftTeeArrow$1 = "\u21A4";
const LeftTee$1 = "\u22A3";
const LeftTeeVector$1 = "\u295A";
const leftthreetimes$1 = "\u22CB";
const LeftTriangleBar$1 = "\u29CF";
const LeftTriangle$1 = "\u22B2";
const LeftTriangleEqual$1 = "\u22B4";
const LeftUpDownVector$1 = "\u2951";
const LeftUpTeeVector$1 = "\u2960";
const LeftUpVectorBar$1 = "\u2958";
const LeftUpVector$1 = "\u21BF";
const LeftVectorBar$1 = "\u2952";
const LeftVector$1 = "\u21BC";
const lEg$1 = "\u2A8B";
const leg$1 = "\u22DA";
const leq$1 = "\u2264";
const leqq$1 = "\u2266";
const leqslant$1 = "\u2A7D";
const lescc$1 = "\u2AA8";
const les$1 = "\u2A7D";
const lesdot$1 = "\u2A7F";
const lesdoto$1 = "\u2A81";
const lesdotor$1 = "\u2A83";
const lesg$1 = "\u22DA\uFE00";
const lesges$1 = "\u2A93";
const lessapprox$1 = "\u2A85";
const lessdot$1 = "\u22D6";
const lesseqgtr$1 = "\u22DA";
const lesseqqgtr$1 = "\u2A8B";
const LessEqualGreater$1 = "\u22DA";
const LessFullEqual$1 = "\u2266";
const LessGreater$1 = "\u2276";
const lessgtr$1 = "\u2276";
const LessLess$1 = "\u2AA1";
const lesssim$1 = "\u2272";
const LessSlantEqual$1 = "\u2A7D";
const LessTilde$1 = "\u2272";
const lfisht$1 = "\u297C";
const lfloor$1 = "\u230A";
const Lfr$1 = "\u{1D50F}";
const lfr$1 = "\u{1D529}";
const lg$1 = "\u2276";
const lgE$1 = "\u2A91";
const lHar$1 = "\u2962";
const lhard$1 = "\u21BD";
const lharu$1 = "\u21BC";
const lharul$1 = "\u296A";
const lhblk$1 = "\u2584";
const LJcy$1 = "\u0409";
const ljcy$1 = "\u0459";
const llarr$1 = "\u21C7";
const ll$1 = "\u226A";
const Ll$1 = "\u22D8";
const llcorner$1 = "\u231E";
const Lleftarrow$1 = "\u21DA";
const llhard$1 = "\u296B";
const lltri$1 = "\u25FA";
const Lmidot$1 = "\u013F";
const lmidot$1 = "\u0140";
const lmoustache$1 = "\u23B0";
const lmoust$1 = "\u23B0";
const lnap$1 = "\u2A89";
const lnapprox$1 = "\u2A89";
const lne$1 = "\u2A87";
const lnE$1 = "\u2268";
const lneq$1 = "\u2A87";
const lneqq$1 = "\u2268";
const lnsim$1 = "\u22E6";
const loang$1 = "\u27EC";
const loarr$1 = "\u21FD";
const lobrk$1 = "\u27E6";
const longleftarrow$1 = "\u27F5";
const LongLeftArrow$1 = "\u27F5";
const Longleftarrow$1 = "\u27F8";
const longleftrightarrow$1 = "\u27F7";
const LongLeftRightArrow$1 = "\u27F7";
const Longleftrightarrow$1 = "\u27FA";
const longmapsto$1 = "\u27FC";
const longrightarrow$1 = "\u27F6";
const LongRightArrow$1 = "\u27F6";
const Longrightarrow$1 = "\u27F9";
const looparrowleft$1 = "\u21AB";
const looparrowright$1 = "\u21AC";
const lopar$1 = "\u2985";
const Lopf$1 = "\u{1D543}";
const lopf$1 = "\u{1D55D}";
const loplus$1 = "\u2A2D";
const lotimes$1 = "\u2A34";
const lowast$1 = "\u2217";
const lowbar$1 = "_";
const LowerLeftArrow$1 = "\u2199";
const LowerRightArrow$1 = "\u2198";
const loz$1 = "\u25CA";
const lozenge$1 = "\u25CA";
const lozf$1 = "\u29EB";
const lpar$1 = "(";
const lparlt$1 = "\u2993";
const lrarr$1 = "\u21C6";
const lrcorner$1 = "\u231F";
const lrhar$1 = "\u21CB";
const lrhard$1 = "\u296D";
const lrm$1 = "\u200E";
const lrtri$1 = "\u22BF";
const lsaquo$1 = "\u2039";
const lscr$1 = "\u{1D4C1}";
const Lscr$1 = "\u2112";
const lsh$1 = "\u21B0";
const Lsh$1 = "\u21B0";
const lsim$1 = "\u2272";
const lsime$1 = "\u2A8D";
const lsimg$1 = "\u2A8F";
const lsqb$1 = "[";
const lsquo$1 = "\u2018";
const lsquor$1 = "\u201A";
const Lstrok$1 = "\u0141";
const lstrok$1 = "\u0142";
const ltcc$1 = "\u2AA6";
const ltcir$1 = "\u2A79";
const lt$5 = "<";
const LT$3 = "<";
const Lt$1 = "\u226A";
const ltdot$1 = "\u22D6";
const lthree$1 = "\u22CB";
const ltimes$1 = "\u22C9";
const ltlarr$1 = "\u2976";
const ltquest$1 = "\u2A7B";
const ltri$1 = "\u25C3";
const ltrie$1 = "\u22B4";
const ltrif$1 = "\u25C2";
const ltrPar$1 = "\u2996";
const lurdshar$1 = "\u294A";
const luruhar$1 = "\u2966";
const lvertneqq$1 = "\u2268\uFE00";
const lvnE$1 = "\u2268\uFE00";
const macr$3 = "\xAF";
const male$1 = "\u2642";
const malt$1 = "\u2720";
const maltese$1 = "\u2720";
const map$1 = "\u21A6";
const mapsto$1 = "\u21A6";
const mapstodown$1 = "\u21A7";
const mapstoleft$1 = "\u21A4";
const mapstoup$1 = "\u21A5";
const marker$1 = "\u25AE";
const mcomma$1 = "\u2A29";
const Mcy$1 = "\u041C";
const mcy$1 = "\u043C";
const mdash$1 = "\u2014";
const mDDot$1 = "\u223A";
const measuredangle$1 = "\u2221";
const MediumSpace$1 = "\u205F";
const Mellintrf$1 = "\u2133";
const Mfr$1 = "\u{1D510}";
const mfr$1 = "\u{1D52A}";
const mho$1 = "\u2127";
const micro$3 = "\xB5";
const midast$1 = "*";
const midcir$1 = "\u2AF0";
const mid$1 = "\u2223";
const middot$3 = "\xB7";
const minusb$1 = "\u229F";
const minus$1 = "\u2212";
const minusd$1 = "\u2238";
const minusdu$1 = "\u2A2A";
const MinusPlus$1 = "\u2213";
const mlcp$1 = "\u2ADB";
const mldr$1 = "\u2026";
const mnplus$1 = "\u2213";
const models$1 = "\u22A7";
const Mopf$1 = "\u{1D544}";
const mopf$1 = "\u{1D55E}";
const mp$1 = "\u2213";
const mscr$1 = "\u{1D4C2}";
const Mscr$1 = "\u2133";
const mstpos$1 = "\u223E";
const Mu$1 = "\u039C";
const mu$1 = "\u03BC";
const multimap$1 = "\u22B8";
const mumap$1 = "\u22B8";
const nabla$1 = "\u2207";
const Nacute$1 = "\u0143";
const nacute$1 = "\u0144";
const nang$1 = "\u2220\u20D2";
const nap$1 = "\u2249";
const napE$1 = "\u2A70\u0338";
const napid$1 = "\u224B\u0338";
const napos$1 = "\u0149";
const napprox$1 = "\u2249";
const natural$1 = "\u266E";
const naturals$1 = "\u2115";
const natur$1 = "\u266E";
const nbsp$3 = "\xA0";
const nbump$1 = "\u224E\u0338";
const nbumpe$1 = "\u224F\u0338";
const ncap$1 = "\u2A43";
const Ncaron$1 = "\u0147";
const ncaron$1 = "\u0148";
const Ncedil$1 = "\u0145";
const ncedil$1 = "\u0146";
const ncong$1 = "\u2247";
const ncongdot$1 = "\u2A6D\u0338";
const ncup$1 = "\u2A42";
const Ncy$1 = "\u041D";
const ncy$1 = "\u043D";
const ndash$1 = "\u2013";
const nearhk$1 = "\u2924";
const nearr$1 = "\u2197";
const neArr$1 = "\u21D7";
const nearrow$1 = "\u2197";
const ne$1 = "\u2260";
const nedot$1 = "\u2250\u0338";
const NegativeMediumSpace$1 = "\u200B";
const NegativeThickSpace$1 = "\u200B";
const NegativeThinSpace$1 = "\u200B";
const NegativeVeryThinSpace$1 = "\u200B";
const nequiv$1 = "\u2262";
const nesear$1 = "\u2928";
const nesim$1 = "\u2242\u0338";
const NestedGreaterGreater$1 = "\u226B";
const NestedLessLess$1 = "\u226A";
const NewLine$1 = "\n";
const nexist$1 = "\u2204";
const nexists$1 = "\u2204";
const Nfr$1 = "\u{1D511}";
const nfr$1 = "\u{1D52B}";
const ngE$1 = "\u2267\u0338";
const nge$1 = "\u2271";
const ngeq$1 = "\u2271";
const ngeqq$1 = "\u2267\u0338";
const ngeqslant$1 = "\u2A7E\u0338";
const nges$1 = "\u2A7E\u0338";
const nGg$1 = "\u22D9\u0338";
const ngsim$1 = "\u2275";
const nGt$1 = "\u226B\u20D2";
const ngt$1 = "\u226F";
const ngtr$1 = "\u226F";
const nGtv$1 = "\u226B\u0338";
const nharr$1 = "\u21AE";
const nhArr$1 = "\u21CE";
const nhpar$1 = "\u2AF2";
const ni$1 = "\u220B";
const nis$1 = "\u22FC";
const nisd$1 = "\u22FA";
const niv$1 = "\u220B";
const NJcy$1 = "\u040A";
const njcy$1 = "\u045A";
const nlarr$1 = "\u219A";
const nlArr$1 = "\u21CD";
const nldr$1 = "\u2025";
const nlE$1 = "\u2266\u0338";
const nle$1 = "\u2270";
const nleftarrow$1 = "\u219A";
const nLeftarrow$1 = "\u21CD";
const nleftrightarrow$1 = "\u21AE";
const nLeftrightarrow$1 = "\u21CE";
const nleq$1 = "\u2270";
const nleqq$1 = "\u2266\u0338";
const nleqslant$1 = "\u2A7D\u0338";
const nles$1 = "\u2A7D\u0338";
const nless$1 = "\u226E";
const nLl$1 = "\u22D8\u0338";
const nlsim$1 = "\u2274";
const nLt$1 = "\u226A\u20D2";
const nlt$1 = "\u226E";
const nltri$1 = "\u22EA";
const nltrie$1 = "\u22EC";
const nLtv$1 = "\u226A\u0338";
const nmid$1 = "\u2224";
const NoBreak$1 = "\u2060";
const NonBreakingSpace$1 = "\xA0";
const nopf$1 = "\u{1D55F}";
const Nopf$1 = "\u2115";
const Not$1 = "\u2AEC";
const not$3 = "\xAC";
const NotCongruent$1 = "\u2262";
const NotCupCap$1 = "\u226D";
const NotDoubleVerticalBar$1 = "\u2226";
const NotElement$1 = "\u2209";
const NotEqual$1 = "\u2260";
const NotEqualTilde$1 = "\u2242\u0338";
const NotExists$1 = "\u2204";
const NotGreater$1 = "\u226F";
const NotGreaterEqual$1 = "\u2271";
const NotGreaterFullEqual$1 = "\u2267\u0338";
const NotGreaterGreater$1 = "\u226B\u0338";
const NotGreaterLess$1 = "\u2279";
const NotGreaterSlantEqual$1 = "\u2A7E\u0338";
const NotGreaterTilde$1 = "\u2275";
const NotHumpDownHump$1 = "\u224E\u0338";
const NotHumpEqual$1 = "\u224F\u0338";
const notin$1 = "\u2209";
const notindot$1 = "\u22F5\u0338";
const notinE$1 = "\u22F9\u0338";
const notinva$1 = "\u2209";
const notinvb$1 = "\u22F7";
const notinvc$1 = "\u22F6";
const NotLeftTriangleBar$1 = "\u29CF\u0338";
const NotLeftTriangle$1 = "\u22EA";
const NotLeftTriangleEqual$1 = "\u22EC";
const NotLess$1 = "\u226E";
const NotLessEqual$1 = "\u2270";
const NotLessGreater$1 = "\u2278";
const NotLessLess$1 = "\u226A\u0338";
const NotLessSlantEqual$1 = "\u2A7D\u0338";
const NotLessTilde$1 = "\u2274";
const NotNestedGreaterGreater$1 = "\u2AA2\u0338";
const NotNestedLessLess$1 = "\u2AA1\u0338";
const notni$1 = "\u220C";
const notniva$1 = "\u220C";
const notnivb$1 = "\u22FE";
const notnivc$1 = "\u22FD";
const NotPrecedes$1 = "\u2280";
const NotPrecedesEqual$1 = "\u2AAF\u0338";
const NotPrecedesSlantEqual$1 = "\u22E0";
const NotReverseElement$1 = "\u220C";
const NotRightTriangleBar$1 = "\u29D0\u0338";
const NotRightTriangle$1 = "\u22EB";
const NotRightTriangleEqual$1 = "\u22ED";
const NotSquareSubset$1 = "\u228F\u0338";
const NotSquareSubsetEqual$1 = "\u22E2";
const NotSquareSuperset$1 = "\u2290\u0338";
const NotSquareSupersetEqual$1 = "\u22E3";
const NotSubset$1 = "\u2282\u20D2";
const NotSubsetEqual$1 = "\u2288";
const NotSucceeds$1 = "\u2281";
const NotSucceedsEqual$1 = "\u2AB0\u0338";
const NotSucceedsSlantEqual$1 = "\u22E1";
const NotSucceedsTilde$1 = "\u227F\u0338";
const NotSuperset$1 = "\u2283\u20D2";
const NotSupersetEqual$1 = "\u2289";
const NotTilde$1 = "\u2241";
const NotTildeEqual$1 = "\u2244";
const NotTildeFullEqual$1 = "\u2247";
const NotTildeTilde$1 = "\u2249";
const NotVerticalBar$1 = "\u2224";
const nparallel$1 = "\u2226";
const npar$1 = "\u2226";
const nparsl$1 = "\u2AFD\u20E5";
const npart$1 = "\u2202\u0338";
const npolint$1 = "\u2A14";
const npr$1 = "\u2280";
const nprcue$1 = "\u22E0";
const nprec$1 = "\u2280";
const npreceq$1 = "\u2AAF\u0338";
const npre$1 = "\u2AAF\u0338";
const nrarrc$1 = "\u2933\u0338";
const nrarr$1 = "\u219B";
const nrArr$1 = "\u21CF";
const nrarrw$1 = "\u219D\u0338";
const nrightarrow$1 = "\u219B";
const nRightarrow$1 = "\u21CF";
const nrtri$1 = "\u22EB";
const nrtrie$1 = "\u22ED";
const nsc$1 = "\u2281";
const nsccue$1 = "\u22E1";
const nsce$1 = "\u2AB0\u0338";
const Nscr$1 = "\u{1D4A9}";
const nscr$1 = "\u{1D4C3}";
const nshortmid$1 = "\u2224";
const nshortparallel$1 = "\u2226";
const nsim$1 = "\u2241";
const nsime$1 = "\u2244";
const nsimeq$1 = "\u2244";
const nsmid$1 = "\u2224";
const nspar$1 = "\u2226";
const nsqsube$1 = "\u22E2";
const nsqsupe$1 = "\u22E3";
const nsub$1 = "\u2284";
const nsubE$1 = "\u2AC5\u0338";
const nsube$1 = "\u2288";
const nsubset$1 = "\u2282\u20D2";
const nsubseteq$1 = "\u2288";
const nsubseteqq$1 = "\u2AC5\u0338";
const nsucc$1 = "\u2281";
const nsucceq$1 = "\u2AB0\u0338";
const nsup$1 = "\u2285";
const nsupE$1 = "\u2AC6\u0338";
const nsupe$1 = "\u2289";
const nsupset$1 = "\u2283\u20D2";
const nsupseteq$1 = "\u2289";
const nsupseteqq$1 = "\u2AC6\u0338";
const ntgl$1 = "\u2279";
const Ntilde$3 = "\xD1";
const ntilde$3 = "\xF1";
const ntlg$1 = "\u2278";
const ntriangleleft$1 = "\u22EA";
const ntrianglelefteq$1 = "\u22EC";
const ntriangleright$1 = "\u22EB";
const ntrianglerighteq$1 = "\u22ED";
const Nu$1 = "\u039D";
const nu$1 = "\u03BD";
const num$1 = "#";
const numero$1 = "\u2116";
const numsp$1 = "\u2007";
const nvap$1 = "\u224D\u20D2";
const nvdash$1 = "\u22AC";
const nvDash$1 = "\u22AD";
const nVdash$1 = "\u22AE";
const nVDash$1 = "\u22AF";
const nvge$1 = "\u2265\u20D2";
const nvgt$1 = ">\u20D2";
const nvHarr$1 = "\u2904";
const nvinfin$1 = "\u29DE";
const nvlArr$1 = "\u2902";
const nvle$1 = "\u2264\u20D2";
const nvlt$1 = "<\u20D2";
const nvltrie$1 = "\u22B4\u20D2";
const nvrArr$1 = "\u2903";
const nvrtrie$1 = "\u22B5\u20D2";
const nvsim$1 = "\u223C\u20D2";
const nwarhk$1 = "\u2923";
const nwarr$1 = "\u2196";
const nwArr$1 = "\u21D6";
const nwarrow$1 = "\u2196";
const nwnear$1 = "\u2927";
const Oacute$3 = "\xD3";
const oacute$3 = "\xF3";
const oast$1 = "\u229B";
const Ocirc$3 = "\xD4";
const ocirc$3 = "\xF4";
const ocir$1 = "\u229A";
const Ocy$1 = "\u041E";
const ocy$1 = "\u043E";
const odash$1 = "\u229D";
const Odblac$1 = "\u0150";
const odblac$1 = "\u0151";
const odiv$1 = "\u2A38";
const odot$1 = "\u2299";
const odsold$1 = "\u29BC";
const OElig$1 = "\u0152";
const oelig$1 = "\u0153";
const ofcir$1 = "\u29BF";
const Ofr$1 = "\u{1D512}";
const ofr$1 = "\u{1D52C}";
const ogon$1 = "\u02DB";
const Ograve$3 = "\xD2";
const ograve$3 = "\xF2";
const ogt$1 = "\u29C1";
const ohbar$1 = "\u29B5";
const ohm$1 = "\u03A9";
const oint$1 = "\u222E";
const olarr$1 = "\u21BA";
const olcir$1 = "\u29BE";
const olcross$1 = "\u29BB";
const oline$1 = "\u203E";
const olt$1 = "\u29C0";
const Omacr$1 = "\u014C";
const omacr$1 = "\u014D";
const Omega$1 = "\u03A9";
const omega$1 = "\u03C9";
const Omicron$1 = "\u039F";
const omicron$1 = "\u03BF";
const omid$1 = "\u29B6";
const ominus$1 = "\u2296";
const Oopf$1 = "\u{1D546}";
const oopf$1 = "\u{1D560}";
const opar$1 = "\u29B7";
const OpenCurlyDoubleQuote$1 = "\u201C";
const OpenCurlyQuote$1 = "\u2018";
const operp$1 = "\u29B9";
const oplus$1 = "\u2295";
const orarr$1 = "\u21BB";
const Or$1 = "\u2A54";
const or$1 = "\u2228";
const ord$1 = "\u2A5D";
const order$1 = "\u2134";
const orderof$1 = "\u2134";
const ordf$3 = "\xAA";
const ordm$3 = "\xBA";
const origof$1 = "\u22B6";
const oror$1 = "\u2A56";
const orslope$1 = "\u2A57";
const orv$1 = "\u2A5B";
const oS$1 = "\u24C8";
const Oscr$1 = "\u{1D4AA}";
const oscr$1 = "\u2134";
const Oslash$3 = "\xD8";
const oslash$3 = "\xF8";
const osol$1 = "\u2298";
const Otilde$3 = "\xD5";
const otilde$3 = "\xF5";
const otimesas$1 = "\u2A36";
const Otimes$1 = "\u2A37";
const otimes$1 = "\u2297";
const Ouml$3 = "\xD6";
const ouml$3 = "\xF6";
const ovbar$1 = "\u233D";
const OverBar$1 = "\u203E";
const OverBrace$1 = "\u23DE";
const OverBracket$1 = "\u23B4";
const OverParenthesis$1 = "\u23DC";
const para$3 = "\xB6";
const parallel$1 = "\u2225";
const par$1 = "\u2225";
const parsim$1 = "\u2AF3";
const parsl$1 = "\u2AFD";
const part$1 = "\u2202";
const PartialD$1 = "\u2202";
const Pcy$1 = "\u041F";
const pcy$1 = "\u043F";
const percnt$1 = "%";
const period$1 = ".";
const permil$1 = "\u2030";
const perp$1 = "\u22A5";
const pertenk$1 = "\u2031";
const Pfr$1 = "\u{1D513}";
const pfr$1 = "\u{1D52D}";
const Phi$1 = "\u03A6";
const phi$1 = "\u03C6";
const phiv$1 = "\u03D5";
const phmmat$1 = "\u2133";
const phone$1 = "\u260E";
const Pi$1 = "\u03A0";
const pi$1 = "\u03C0";
const pitchfork$1 = "\u22D4";
const piv$1 = "\u03D6";
const planck$1 = "\u210F";
const planckh$1 = "\u210E";
const plankv$1 = "\u210F";
const plusacir$1 = "\u2A23";
const plusb$1 = "\u229E";
const pluscir$1 = "\u2A22";
const plus$1 = "+";
const plusdo$1 = "\u2214";
const plusdu$1 = "\u2A25";
const pluse$1 = "\u2A72";
const PlusMinus$1 = "\xB1";
const plusmn$3 = "\xB1";
const plussim$1 = "\u2A26";
const plustwo$1 = "\u2A27";
const pm$1 = "\xB1";
const Poincareplane$1 = "\u210C";
const pointint$1 = "\u2A15";
const popf$1 = "\u{1D561}";
const Popf$1 = "\u2119";
const pound$3 = "\xA3";
const prap$1 = "\u2AB7";
const Pr$1 = "\u2ABB";
const pr$1 = "\u227A";
const prcue$1 = "\u227C";
const precapprox$1 = "\u2AB7";
const prec$1 = "\u227A";
const preccurlyeq$1 = "\u227C";
const Precedes$1 = "\u227A";
const PrecedesEqual$1 = "\u2AAF";
const PrecedesSlantEqual$1 = "\u227C";
const PrecedesTilde$1 = "\u227E";
const preceq$1 = "\u2AAF";
const precnapprox$1 = "\u2AB9";
const precneqq$1 = "\u2AB5";
const precnsim$1 = "\u22E8";
const pre$1 = "\u2AAF";
const prE$1 = "\u2AB3";
const precsim$1 = "\u227E";
const prime$1 = "\u2032";
const Prime$1 = "\u2033";
const primes$1 = "\u2119";
const prnap$1 = "\u2AB9";
const prnE$1 = "\u2AB5";
const prnsim$1 = "\u22E8";
const prod$1 = "\u220F";
const Product$1 = "\u220F";
const profalar$1 = "\u232E";
const profline$1 = "\u2312";
const profsurf$1 = "\u2313";
const prop$1 = "\u221D";
const Proportional$1 = "\u221D";
const Proportion$1 = "\u2237";
const propto$1 = "\u221D";
const prsim$1 = "\u227E";
const prurel$1 = "\u22B0";
const Pscr$1 = "\u{1D4AB}";
const pscr$1 = "\u{1D4C5}";
const Psi$1 = "\u03A8";
const psi$1 = "\u03C8";
const puncsp$1 = "\u2008";
const Qfr$1 = "\u{1D514}";
const qfr$1 = "\u{1D52E}";
const qint$1 = "\u2A0C";
const qopf$1 = "\u{1D562}";
const Qopf$1 = "\u211A";
const qprime$1 = "\u2057";
const Qscr$1 = "\u{1D4AC}";
const qscr$1 = "\u{1D4C6}";
const quaternions$1 = "\u210D";
const quatint$1 = "\u2A16";
const quest$1 = "?";
const questeq$1 = "\u225F";
const quot$5 = '"';
const QUOT$3 = '"';
const rAarr$1 = "\u21DB";
const race$1 = "\u223D\u0331";
const Racute$1 = "\u0154";
const racute$1 = "\u0155";
const radic$1 = "\u221A";
const raemptyv$1 = "\u29B3";
const rang$1 = "\u27E9";
const Rang$1 = "\u27EB";
const rangd$1 = "\u2992";
const range$1 = "\u29A5";
const rangle$1 = "\u27E9";
const raquo$3 = "\xBB";
const rarrap$1 = "\u2975";
const rarrb$1 = "\u21E5";
const rarrbfs$1 = "\u2920";
const rarrc$1 = "\u2933";
const rarr$1 = "\u2192";
const Rarr$1 = "\u21A0";
const rArr$1 = "\u21D2";
const rarrfs$1 = "\u291E";
const rarrhk$1 = "\u21AA";
const rarrlp$1 = "\u21AC";
const rarrpl$1 = "\u2945";
const rarrsim$1 = "\u2974";
const Rarrtl$1 = "\u2916";
const rarrtl$1 = "\u21A3";
const rarrw$1 = "\u219D";
const ratail$1 = "\u291A";
const rAtail$1 = "\u291C";
const ratio$1 = "\u2236";
const rationals$1 = "\u211A";
const rbarr$1 = "\u290D";
const rBarr$1 = "\u290F";
const RBarr$1 = "\u2910";
const rbbrk$1 = "\u2773";
const rbrace$1 = "}";
const rbrack$1 = "]";
const rbrke$1 = "\u298C";
const rbrksld$1 = "\u298E";
const rbrkslu$1 = "\u2990";
const Rcaron$1 = "\u0158";
const rcaron$1 = "\u0159";
const Rcedil$1 = "\u0156";
const rcedil$1 = "\u0157";
const rceil$1 = "\u2309";
const rcub$1 = "}";
const Rcy$1 = "\u0420";
const rcy$1 = "\u0440";
const rdca$1 = "\u2937";
const rdldhar$1 = "\u2969";
const rdquo$1 = "\u201D";
const rdquor$1 = "\u201D";
const rdsh$1 = "\u21B3";
const real$1 = "\u211C";
const realine$1 = "\u211B";
const realpart$1 = "\u211C";
const reals$1 = "\u211D";
const Re$1 = "\u211C";
const rect$1 = "\u25AD";
const reg$3 = "\xAE";
const REG$3 = "\xAE";
const ReverseElement$1 = "\u220B";
const ReverseEquilibrium$1 = "\u21CB";
const ReverseUpEquilibrium$1 = "\u296F";
const rfisht$1 = "\u297D";
const rfloor$1 = "\u230B";
const rfr$1 = "\u{1D52F}";
const Rfr$1 = "\u211C";
const rHar$1 = "\u2964";
const rhard$1 = "\u21C1";
const rharu$1 = "\u21C0";
const rharul$1 = "\u296C";
const Rho$1 = "\u03A1";
const rho$1 = "\u03C1";
const rhov$1 = "\u03F1";
const RightAngleBracket$1 = "\u27E9";
const RightArrowBar$1 = "\u21E5";
const rightarrow$1 = "\u2192";
const RightArrow$1 = "\u2192";
const Rightarrow$1 = "\u21D2";
const RightArrowLeftArrow$1 = "\u21C4";
const rightarrowtail$1 = "\u21A3";
const RightCeiling$1 = "\u2309";
const RightDoubleBracket$1 = "\u27E7";
const RightDownTeeVector$1 = "\u295D";
const RightDownVectorBar$1 = "\u2955";
const RightDownVector$1 = "\u21C2";
const RightFloor$1 = "\u230B";
const rightharpoondown$1 = "\u21C1";
const rightharpoonup$1 = "\u21C0";
const rightleftarrows$1 = "\u21C4";
const rightleftharpoons$1 = "\u21CC";
const rightrightarrows$1 = "\u21C9";
const rightsquigarrow$1 = "\u219D";
const RightTeeArrow$1 = "\u21A6";
const RightTee$1 = "\u22A2";
const RightTeeVector$1 = "\u295B";
const rightthreetimes$1 = "\u22CC";
const RightTriangleBar$1 = "\u29D0";
const RightTriangle$1 = "\u22B3";
const RightTriangleEqual$1 = "\u22B5";
const RightUpDownVector$1 = "\u294F";
const RightUpTeeVector$1 = "\u295C";
const RightUpVectorBar$1 = "\u2954";
const RightUpVector$1 = "\u21BE";
const RightVectorBar$1 = "\u2953";
const RightVector$1 = "\u21C0";
const ring$1 = "\u02DA";
const risingdotseq$1 = "\u2253";
const rlarr$1 = "\u21C4";
const rlhar$1 = "\u21CC";
const rlm$1 = "\u200F";
const rmoustache$1 = "\u23B1";
const rmoust$1 = "\u23B1";
const rnmid$1 = "\u2AEE";
const roang$1 = "\u27ED";
const roarr$1 = "\u21FE";
const robrk$1 = "\u27E7";
const ropar$1 = "\u2986";
const ropf$1 = "\u{1D563}";
const Ropf$1 = "\u211D";
const roplus$1 = "\u2A2E";
const rotimes$1 = "\u2A35";
const RoundImplies$1 = "\u2970";
const rpar$1 = ")";
const rpargt$1 = "\u2994";
const rppolint$1 = "\u2A12";
const rrarr$1 = "\u21C9";
const Rrightarrow$1 = "\u21DB";
const rsaquo$1 = "\u203A";
const rscr$1 = "\u{1D4C7}";
const Rscr$1 = "\u211B";
const rsh$1 = "\u21B1";
const Rsh$1 = "\u21B1";
const rsqb$1 = "]";
const rsquo$1 = "\u2019";
const rsquor$1 = "\u2019";
const rthree$1 = "\u22CC";
const rtimes$1 = "\u22CA";
const rtri$1 = "\u25B9";
const rtrie$1 = "\u22B5";
const rtrif$1 = "\u25B8";
const rtriltri$1 = "\u29CE";
const RuleDelayed$1 = "\u29F4";
const ruluhar$1 = "\u2968";
const rx$1 = "\u211E";
const Sacute$1 = "\u015A";
const sacute$1 = "\u015B";
const sbquo$1 = "\u201A";
const scap$1 = "\u2AB8";
const Scaron$1 = "\u0160";
const scaron$1 = "\u0161";
const Sc$1 = "\u2ABC";
const sc$1 = "\u227B";
const sccue$1 = "\u227D";
const sce$1 = "\u2AB0";
const scE$1 = "\u2AB4";
const Scedil$1 = "\u015E";
const scedil$1 = "\u015F";
const Scirc$1 = "\u015C";
const scirc$1 = "\u015D";
const scnap$1 = "\u2ABA";
const scnE$1 = "\u2AB6";
const scnsim$1 = "\u22E9";
const scpolint$1 = "\u2A13";
const scsim$1 = "\u227F";
const Scy$1 = "\u0421";
const scy$1 = "\u0441";
const sdotb$1 = "\u22A1";
const sdot$1 = "\u22C5";
const sdote$1 = "\u2A66";
const searhk$1 = "\u2925";
const searr$1 = "\u2198";
const seArr$1 = "\u21D8";
const searrow$1 = "\u2198";
const sect$3 = "\xA7";
const semi$1 = ";";
const seswar$1 = "\u2929";
const setminus$1 = "\u2216";
const setmn$1 = "\u2216";
const sext$1 = "\u2736";
const Sfr$1 = "\u{1D516}";
const sfr$1 = "\u{1D530}";
const sfrown$1 = "\u2322";
const sharp$1 = "\u266F";
const SHCHcy$1 = "\u0429";
const shchcy$1 = "\u0449";
const SHcy$1 = "\u0428";
const shcy$1 = "\u0448";
const ShortDownArrow$1 = "\u2193";
const ShortLeftArrow$1 = "\u2190";
const shortmid$1 = "\u2223";
const shortparallel$1 = "\u2225";
const ShortRightArrow$1 = "\u2192";
const ShortUpArrow$1 = "\u2191";
const shy$3 = "\xAD";
const Sigma$1 = "\u03A3";
const sigma$1 = "\u03C3";
const sigmaf$1 = "\u03C2";
const sigmav$1 = "\u03C2";
const sim$1 = "\u223C";
const simdot$1 = "\u2A6A";
const sime$1 = "\u2243";
const simeq$1 = "\u2243";
const simg$1 = "\u2A9E";
const simgE$1 = "\u2AA0";
const siml$1 = "\u2A9D";
const simlE$1 = "\u2A9F";
const simne$1 = "\u2246";
const simplus$1 = "\u2A24";
const simrarr$1 = "\u2972";
const slarr$1 = "\u2190";
const SmallCircle$1 = "\u2218";
const smallsetminus$1 = "\u2216";
const smashp$1 = "\u2A33";
const smeparsl$1 = "\u29E4";
const smid$1 = "\u2223";
const smile$1 = "\u2323";
const smt$1 = "\u2AAA";
const smte$1 = "\u2AAC";
const smtes$1 = "\u2AAC\uFE00";
const SOFTcy$1 = "\u042C";
const softcy$1 = "\u044C";
const solbar$1 = "\u233F";
const solb$1 = "\u29C4";
const sol$1 = "/";
const Sopf$1 = "\u{1D54A}";
const sopf$1 = "\u{1D564}";
const spades$1 = "\u2660";
const spadesuit$1 = "\u2660";
const spar$1 = "\u2225";
const sqcap$1 = "\u2293";
const sqcaps$1 = "\u2293\uFE00";
const sqcup$1 = "\u2294";
const sqcups$1 = "\u2294\uFE00";
const Sqrt$1 = "\u221A";
const sqsub$1 = "\u228F";
const sqsube$1 = "\u2291";
const sqsubset$1 = "\u228F";
const sqsubseteq$1 = "\u2291";
const sqsup$1 = "\u2290";
const sqsupe$1 = "\u2292";
const sqsupset$1 = "\u2290";
const sqsupseteq$1 = "\u2292";
const square$1 = "\u25A1";
const Square$1 = "\u25A1";
const SquareIntersection$1 = "\u2293";
const SquareSubset$1 = "\u228F";
const SquareSubsetEqual$1 = "\u2291";
const SquareSuperset$1 = "\u2290";
const SquareSupersetEqual$1 = "\u2292";
const SquareUnion$1 = "\u2294";
const squarf$1 = "\u25AA";
const squ$1 = "\u25A1";
const squf$1 = "\u25AA";
const srarr$1 = "\u2192";
const Sscr$1 = "\u{1D4AE}";
const sscr$1 = "\u{1D4C8}";
const ssetmn$1 = "\u2216";
const ssmile$1 = "\u2323";
const sstarf$1 = "\u22C6";
const Star$1 = "\u22C6";
const star$1 = "\u2606";
const starf$1 = "\u2605";
const straightepsilon$1 = "\u03F5";
const straightphi$1 = "\u03D5";
const strns$1 = "\xAF";
const sub$1 = "\u2282";
const Sub$1 = "\u22D0";
const subdot$1 = "\u2ABD";
const subE$1 = "\u2AC5";
const sube$1 = "\u2286";
const subedot$1 = "\u2AC3";
const submult$1 = "\u2AC1";
const subnE$1 = "\u2ACB";
const subne$1 = "\u228A";
const subplus$1 = "\u2ABF";
const subrarr$1 = "\u2979";
const subset$1 = "\u2282";
const Subset$1 = "\u22D0";
const subseteq$1 = "\u2286";
const subseteqq$1 = "\u2AC5";
const SubsetEqual$1 = "\u2286";
const subsetneq$1 = "\u228A";
const subsetneqq$1 = "\u2ACB";
const subsim$1 = "\u2AC7";
const subsub$1 = "\u2AD5";
const subsup$1 = "\u2AD3";
const succapprox$1 = "\u2AB8";
const succ$1 = "\u227B";
const succcurlyeq$1 = "\u227D";
const Succeeds$1 = "\u227B";
const SucceedsEqual$1 = "\u2AB0";
const SucceedsSlantEqual$1 = "\u227D";
const SucceedsTilde$1 = "\u227F";
const succeq$1 = "\u2AB0";
const succnapprox$1 = "\u2ABA";
const succneqq$1 = "\u2AB6";
const succnsim$1 = "\u22E9";
const succsim$1 = "\u227F";
const SuchThat$1 = "\u220B";
const sum$1 = "\u2211";
const Sum$1 = "\u2211";
const sung$1 = "\u266A";
const sup1$3 = "\xB9";
const sup2$3 = "\xB2";
const sup3$3 = "\xB3";
const sup$1 = "\u2283";
const Sup$1 = "\u22D1";
const supdot$1 = "\u2ABE";
const supdsub$1 = "\u2AD8";
const supE$1 = "\u2AC6";
const supe$1 = "\u2287";
const supedot$1 = "\u2AC4";
const Superset$1 = "\u2283";
const SupersetEqual$1 = "\u2287";
const suphsol$1 = "\u27C9";
const suphsub$1 = "\u2AD7";
const suplarr$1 = "\u297B";
const supmult$1 = "\u2AC2";
const supnE$1 = "\u2ACC";
const supne$1 = "\u228B";
const supplus$1 = "\u2AC0";
const supset$1 = "\u2283";
const Supset$1 = "\u22D1";
const supseteq$1 = "\u2287";
const supseteqq$1 = "\u2AC6";
const supsetneq$1 = "\u228B";
const supsetneqq$1 = "\u2ACC";
const supsim$1 = "\u2AC8";
const supsub$1 = "\u2AD4";
const supsup$1 = "\u2AD6";
const swarhk$1 = "\u2926";
const swarr$1 = "\u2199";
const swArr$1 = "\u21D9";
const swarrow$1 = "\u2199";
const swnwar$1 = "\u292A";
const szlig$3 = "\xDF";
const Tab$1 = "	";
const target$1 = "\u2316";
const Tau$1 = "\u03A4";
const tau$1 = "\u03C4";
const tbrk$1 = "\u23B4";
const Tcaron$1 = "\u0164";
const tcaron$1 = "\u0165";
const Tcedil$1 = "\u0162";
const tcedil$1 = "\u0163";
const Tcy$1 = "\u0422";
const tcy$1 = "\u0442";
const tdot$1 = "\u20DB";
const telrec$1 = "\u2315";
const Tfr$1 = "\u{1D517}";
const tfr$1 = "\u{1D531}";
const there4$1 = "\u2234";
const therefore$1 = "\u2234";
const Therefore$1 = "\u2234";
const Theta$1 = "\u0398";
const theta$1 = "\u03B8";
const thetasym$1 = "\u03D1";
const thetav$1 = "\u03D1";
const thickapprox$1 = "\u2248";
const thicksim$1 = "\u223C";
const ThickSpace$1 = "\u205F\u200A";
const ThinSpace$1 = "\u2009";
const thinsp$1 = "\u2009";
const thkap$1 = "\u2248";
const thksim$1 = "\u223C";
const THORN$3 = "\xDE";
const thorn$3 = "\xFE";
const tilde$1 = "\u02DC";
const Tilde$1 = "\u223C";
const TildeEqual$1 = "\u2243";
const TildeFullEqual$1 = "\u2245";
const TildeTilde$1 = "\u2248";
const timesbar$1 = "\u2A31";
const timesb$1 = "\u22A0";
const times$3 = "\xD7";
const timesd$1 = "\u2A30";
const tint$1 = "\u222D";
const toea$1 = "\u2928";
const topbot$1 = "\u2336";
const topcir$1 = "\u2AF1";
const top$1 = "\u22A4";
const Topf$1 = "\u{1D54B}";
const topf$1 = "\u{1D565}";
const topfork$1 = "\u2ADA";
const tosa$1 = "\u2929";
const tprime$1 = "\u2034";
const trade$1 = "\u2122";
const TRADE$1 = "\u2122";
const triangle$1 = "\u25B5";
const triangledown$1 = "\u25BF";
const triangleleft$1 = "\u25C3";
const trianglelefteq$1 = "\u22B4";
const triangleq$1 = "\u225C";
const triangleright$1 = "\u25B9";
const trianglerighteq$1 = "\u22B5";
const tridot$1 = "\u25EC";
const trie$1 = "\u225C";
const triminus$1 = "\u2A3A";
const TripleDot$1 = "\u20DB";
const triplus$1 = "\u2A39";
const trisb$1 = "\u29CD";
const tritime$1 = "\u2A3B";
const trpezium$1 = "\u23E2";
const Tscr$1 = "\u{1D4AF}";
const tscr$1 = "\u{1D4C9}";
const TScy$1 = "\u0426";
const tscy$1 = "\u0446";
const TSHcy$1 = "\u040B";
const tshcy$1 = "\u045B";
const Tstrok$1 = "\u0166";
const tstrok$1 = "\u0167";
const twixt$1 = "\u226C";
const twoheadleftarrow$1 = "\u219E";
const twoheadrightarrow$1 = "\u21A0";
const Uacute$3 = "\xDA";
const uacute$3 = "\xFA";
const uarr$1 = "\u2191";
const Uarr$1 = "\u219F";
const uArr$1 = "\u21D1";
const Uarrocir$1 = "\u2949";
const Ubrcy$1 = "\u040E";
const ubrcy$1 = "\u045E";
const Ubreve$1 = "\u016C";
const ubreve$1 = "\u016D";
const Ucirc$3 = "\xDB";
const ucirc$3 = "\xFB";
const Ucy$1 = "\u0423";
const ucy$1 = "\u0443";
const udarr$1 = "\u21C5";
const Udblac$1 = "\u0170";
const udblac$1 = "\u0171";
const udhar$1 = "\u296E";
const ufisht$1 = "\u297E";
const Ufr$1 = "\u{1D518}";
const ufr$1 = "\u{1D532}";
const Ugrave$3 = "\xD9";
const ugrave$3 = "\xF9";
const uHar$1 = "\u2963";
const uharl$1 = "\u21BF";
const uharr$1 = "\u21BE";
const uhblk$1 = "\u2580";
const ulcorn$1 = "\u231C";
const ulcorner$1 = "\u231C";
const ulcrop$1 = "\u230F";
const ultri$1 = "\u25F8";
const Umacr$1 = "\u016A";
const umacr$1 = "\u016B";
const uml$3 = "\xA8";
const UnderBar$1 = "_";
const UnderBrace$1 = "\u23DF";
const UnderBracket$1 = "\u23B5";
const UnderParenthesis$1 = "\u23DD";
const Union$1 = "\u22C3";
const UnionPlus$1 = "\u228E";
const Uogon$1 = "\u0172";
const uogon$1 = "\u0173";
const Uopf$1 = "\u{1D54C}";
const uopf$1 = "\u{1D566}";
const UpArrowBar$1 = "\u2912";
const uparrow$1 = "\u2191";
const UpArrow$1 = "\u2191";
const Uparrow$1 = "\u21D1";
const UpArrowDownArrow$1 = "\u21C5";
const updownarrow$1 = "\u2195";
const UpDownArrow$1 = "\u2195";
const Updownarrow$1 = "\u21D5";
const UpEquilibrium$1 = "\u296E";
const upharpoonleft$1 = "\u21BF";
const upharpoonright$1 = "\u21BE";
const uplus$1 = "\u228E";
const UpperLeftArrow$1 = "\u2196";
const UpperRightArrow$1 = "\u2197";
const upsi$1 = "\u03C5";
const Upsi$1 = "\u03D2";
const upsih$1 = "\u03D2";
const Upsilon$1 = "\u03A5";
const upsilon$1 = "\u03C5";
const UpTeeArrow$1 = "\u21A5";
const UpTee$1 = "\u22A5";
const upuparrows$1 = "\u21C8";
const urcorn$1 = "\u231D";
const urcorner$1 = "\u231D";
const urcrop$1 = "\u230E";
const Uring$1 = "\u016E";
const uring$1 = "\u016F";
const urtri$1 = "\u25F9";
const Uscr$1 = "\u{1D4B0}";
const uscr$1 = "\u{1D4CA}";
const utdot$1 = "\u22F0";
const Utilde$1 = "\u0168";
const utilde$1 = "\u0169";
const utri$1 = "\u25B5";
const utrif$1 = "\u25B4";
const uuarr$1 = "\u21C8";
const Uuml$3 = "\xDC";
const uuml$3 = "\xFC";
const uwangle$1 = "\u29A7";
const vangrt$1 = "\u299C";
const varepsilon$1 = "\u03F5";
const varkappa$1 = "\u03F0";
const varnothing$1 = "\u2205";
const varphi$1 = "\u03D5";
const varpi$1 = "\u03D6";
const varpropto$1 = "\u221D";
const varr$1 = "\u2195";
const vArr$1 = "\u21D5";
const varrho$1 = "\u03F1";
const varsigma$1 = "\u03C2";
const varsubsetneq$1 = "\u228A\uFE00";
const varsubsetneqq$1 = "\u2ACB\uFE00";
const varsupsetneq$1 = "\u228B\uFE00";
const varsupsetneqq$1 = "\u2ACC\uFE00";
const vartheta$1 = "\u03D1";
const vartriangleleft$1 = "\u22B2";
const vartriangleright$1 = "\u22B3";
const vBar$1 = "\u2AE8";
const Vbar$1 = "\u2AEB";
const vBarv$1 = "\u2AE9";
const Vcy$1 = "\u0412";
const vcy$1 = "\u0432";
const vdash$1 = "\u22A2";
const vDash$1 = "\u22A8";
const Vdash$1 = "\u22A9";
const VDash$1 = "\u22AB";
const Vdashl$1 = "\u2AE6";
const veebar$1 = "\u22BB";
const vee$1 = "\u2228";
const Vee$1 = "\u22C1";
const veeeq$1 = "\u225A";
const vellip$1 = "\u22EE";
const verbar$1 = "|";
const Verbar$1 = "\u2016";
const vert$1 = "|";
const Vert$1 = "\u2016";
const VerticalBar$1 = "\u2223";
const VerticalLine$1 = "|";
const VerticalSeparator$1 = "\u2758";
const VerticalTilde$1 = "\u2240";
const VeryThinSpace$1 = "\u200A";
const Vfr$1 = "\u{1D519}";
const vfr$1 = "\u{1D533}";
const vltri$1 = "\u22B2";
const vnsub$1 = "\u2282\u20D2";
const vnsup$1 = "\u2283\u20D2";
const Vopf$1 = "\u{1D54D}";
const vopf$1 = "\u{1D567}";
const vprop$1 = "\u221D";
const vrtri$1 = "\u22B3";
const Vscr$1 = "\u{1D4B1}";
const vscr$1 = "\u{1D4CB}";
const vsubnE$1 = "\u2ACB\uFE00";
const vsubne$1 = "\u228A\uFE00";
const vsupnE$1 = "\u2ACC\uFE00";
const vsupne$1 = "\u228B\uFE00";
const Vvdash$1 = "\u22AA";
const vzigzag$1 = "\u299A";
const Wcirc$1 = "\u0174";
const wcirc$1 = "\u0175";
const wedbar$1 = "\u2A5F";
const wedge$1 = "\u2227";
const Wedge$1 = "\u22C0";
const wedgeq$1 = "\u2259";
const weierp$1 = "\u2118";
const Wfr$1 = "\u{1D51A}";
const wfr$1 = "\u{1D534}";
const Wopf$1 = "\u{1D54E}";
const wopf$1 = "\u{1D568}";
const wp$1 = "\u2118";
const wr$1 = "\u2240";
const wreath$1 = "\u2240";
const Wscr$1 = "\u{1D4B2}";
const wscr$1 = "\u{1D4CC}";
const xcap$1 = "\u22C2";
const xcirc$1 = "\u25EF";
const xcup$1 = "\u22C3";
const xdtri$1 = "\u25BD";
const Xfr$1 = "\u{1D51B}";
const xfr$1 = "\u{1D535}";
const xharr$1 = "\u27F7";
const xhArr$1 = "\u27FA";
const Xi$1 = "\u039E";
const xi$1 = "\u03BE";
const xlarr$1 = "\u27F5";
const xlArr$1 = "\u27F8";
const xmap$1 = "\u27FC";
const xnis$1 = "\u22FB";
const xodot$1 = "\u2A00";
const Xopf$1 = "\u{1D54F}";
const xopf$1 = "\u{1D569}";
const xoplus$1 = "\u2A01";
const xotime$1 = "\u2A02";
const xrarr$1 = "\u27F6";
const xrArr$1 = "\u27F9";
const Xscr$1 = "\u{1D4B3}";
const xscr$1 = "\u{1D4CD}";
const xsqcup$1 = "\u2A06";
const xuplus$1 = "\u2A04";
const xutri$1 = "\u25B3";
const xvee$1 = "\u22C1";
const xwedge$1 = "\u22C0";
const Yacute$3 = "\xDD";
const yacute$3 = "\xFD";
const YAcy$1 = "\u042F";
const yacy$1 = "\u044F";
const Ycirc$1 = "\u0176";
const ycirc$1 = "\u0177";
const Ycy$1 = "\u042B";
const ycy$1 = "\u044B";
const yen$3 = "\xA5";
const Yfr$1 = "\u{1D51C}";
const yfr$1 = "\u{1D536}";
const YIcy$1 = "\u0407";
const yicy$1 = "\u0457";
const Yopf$1 = "\u{1D550}";
const yopf$1 = "\u{1D56A}";
const Yscr$1 = "\u{1D4B4}";
const yscr$1 = "\u{1D4CE}";
const YUcy$1 = "\u042E";
const yucy$1 = "\u044E";
const yuml$3 = "\xFF";
const Yuml$1 = "\u0178";
const Zacute$1 = "\u0179";
const zacute$1 = "\u017A";
const Zcaron$1 = "\u017D";
const zcaron$1 = "\u017E";
const Zcy$1 = "\u0417";
const zcy$1 = "\u0437";
const Zdot$1 = "\u017B";
const zdot$1 = "\u017C";
const zeetrf$1 = "\u2128";
const ZeroWidthSpace$1 = "\u200B";
const Zeta$1 = "\u0396";
const zeta$1 = "\u03B6";
const zfr$1 = "\u{1D537}";
const Zfr$1 = "\u2128";
const ZHcy$1 = "\u0416";
const zhcy$1 = "\u0436";
const zigrarr$1 = "\u21DD";
const zopf$1 = "\u{1D56B}";
const Zopf$1 = "\u2124";
const Zscr$1 = "\u{1D4B5}";
const zscr$1 = "\u{1D4CF}";
const zwj$1 = "\u200D";
const zwnj$1 = "\u200C";
const require$$1$2 = {
  Aacute: Aacute$3,
  aacute: aacute$3,
  Abreve: Abreve$1,
  abreve: abreve$1,
  ac: ac$1,
  acd: acd$1,
  acE: acE$1,
  Acirc: Acirc$3,
  acirc: acirc$3,
  acute: acute$3,
  Acy: Acy$1,
  acy: acy$1,
  AElig: AElig$3,
  aelig: aelig$3,
  af: af$1,
  Afr: Afr$1,
  afr: afr$1,
  Agrave: Agrave$3,
  agrave: agrave$3,
  alefsym: alefsym$1,
  aleph: aleph$1,
  Alpha: Alpha$1,
  alpha: alpha$1,
  Amacr: Amacr$1,
  amacr: amacr$1,
  amalg: amalg$1,
  amp: amp$5,
  AMP: AMP$3,
  andand: andand$1,
  And: And$1,
  and: and$1,
  andd: andd$1,
  andslope: andslope$1,
  andv: andv$1,
  ang: ang$1,
  ange: ange$1,
  angle: angle$1,
  angmsdaa: angmsdaa$1,
  angmsdab: angmsdab$1,
  angmsdac: angmsdac$1,
  angmsdad: angmsdad$1,
  angmsdae: angmsdae$1,
  angmsdaf: angmsdaf$1,
  angmsdag: angmsdag$1,
  angmsdah: angmsdah$1,
  angmsd: angmsd$1,
  angrt: angrt$1,
  angrtvb: angrtvb$1,
  angrtvbd: angrtvbd$1,
  angsph: angsph$1,
  angst: angst$1,
  angzarr: angzarr$1,
  Aogon: Aogon$1,
  aogon: aogon$1,
  Aopf: Aopf$1,
  aopf: aopf$1,
  apacir: apacir$1,
  ap: ap$1,
  apE: apE$1,
  ape: ape$1,
  apid: apid$1,
  apos: apos$3,
  ApplyFunction: ApplyFunction$1,
  approx: approx$1,
  approxeq: approxeq$1,
  Aring: Aring$3,
  aring: aring$3,
  Ascr: Ascr$1,
  ascr: ascr$1,
  Assign: Assign$1,
  ast: ast$1,
  asymp: asymp$1,
  asympeq: asympeq$1,
  Atilde: Atilde$3,
  atilde: atilde$3,
  Auml: Auml$3,
  auml: auml$3,
  awconint: awconint$1,
  awint: awint$1,
  backcong: backcong$1,
  backepsilon: backepsilon$1,
  backprime: backprime$1,
  backsim: backsim$1,
  backsimeq: backsimeq$1,
  Backslash: Backslash$1,
  Barv: Barv$1,
  barvee: barvee$1,
  barwed: barwed$1,
  Barwed: Barwed$1,
  barwedge: barwedge$1,
  bbrk: bbrk$1,
  bbrktbrk: bbrktbrk$1,
  bcong: bcong$1,
  Bcy: Bcy$1,
  bcy: bcy$1,
  bdquo: bdquo$1,
  becaus: becaus$1,
  because: because$1,
  Because: Because$1,
  bemptyv: bemptyv$1,
  bepsi: bepsi$1,
  bernou: bernou$1,
  Bernoullis: Bernoullis$1,
  Beta: Beta$1,
  beta: beta$1,
  beth: beth$1,
  between: between$1,
  Bfr: Bfr$1,
  bfr: bfr$1,
  bigcap: bigcap$1,
  bigcirc: bigcirc$1,
  bigcup: bigcup$1,
  bigodot: bigodot$1,
  bigoplus: bigoplus$1,
  bigotimes: bigotimes$1,
  bigsqcup: bigsqcup$1,
  bigstar: bigstar$1,
  bigtriangledown: bigtriangledown$1,
  bigtriangleup: bigtriangleup$1,
  biguplus: biguplus$1,
  bigvee: bigvee$1,
  bigwedge: bigwedge$1,
  bkarow: bkarow$1,
  blacklozenge: blacklozenge$1,
  blacksquare: blacksquare$1,
  blacktriangle: blacktriangle$1,
  blacktriangledown: blacktriangledown$1,
  blacktriangleleft: blacktriangleleft$1,
  blacktriangleright: blacktriangleright$1,
  blank: blank$1,
  blk12: blk12$1,
  blk14: blk14$1,
  blk34: blk34$1,
  block: block$1,
  bne: bne$1,
  bnequiv: bnequiv$1,
  bNot: bNot$1,
  bnot: bnot$1,
  Bopf: Bopf$1,
  bopf: bopf$1,
  bot: bot$1,
  bottom: bottom$1,
  bowtie: bowtie$1,
  boxbox: boxbox$1,
  boxdl: boxdl$1,
  boxdL: boxdL$1,
  boxDl: boxDl$1,
  boxDL: boxDL$1,
  boxdr: boxdr$1,
  boxdR: boxdR$1,
  boxDr: boxDr$1,
  boxDR: boxDR$1,
  boxh: boxh$1,
  boxH: boxH$1,
  boxhd: boxhd$1,
  boxHd: boxHd$1,
  boxhD: boxhD$1,
  boxHD: boxHD$1,
  boxhu: boxhu$1,
  boxHu: boxHu$1,
  boxhU: boxhU$1,
  boxHU: boxHU$1,
  boxminus: boxminus$1,
  boxplus: boxplus$1,
  boxtimes: boxtimes$1,
  boxul: boxul$1,
  boxuL: boxuL$1,
  boxUl: boxUl$1,
  boxUL: boxUL$1,
  boxur: boxur$1,
  boxuR: boxuR$1,
  boxUr: boxUr$1,
  boxUR: boxUR$1,
  boxv: boxv$1,
  boxV: boxV$1,
  boxvh: boxvh$1,
  boxvH: boxvH$1,
  boxVh: boxVh$1,
  boxVH: boxVH$1,
  boxvl: boxvl$1,
  boxvL: boxvL$1,
  boxVl: boxVl$1,
  boxVL: boxVL$1,
  boxvr: boxvr$1,
  boxvR: boxvR$1,
  boxVr: boxVr$1,
  boxVR: boxVR$1,
  bprime: bprime$1,
  breve: breve$1,
  Breve: Breve$1,
  brvbar: brvbar$3,
  bscr: bscr$1,
  Bscr: Bscr$1,
  bsemi: bsemi$1,
  bsim: bsim$1,
  bsime: bsime$1,
  bsolb: bsolb$1,
  bsol: bsol$1,
  bsolhsub: bsolhsub$1,
  bull: bull$1,
  bullet: bullet$1,
  bump: bump$1,
  bumpE: bumpE$1,
  bumpe: bumpe$1,
  Bumpeq: Bumpeq$1,
  bumpeq: bumpeq$1,
  Cacute: Cacute$1,
  cacute: cacute$1,
  capand: capand$1,
  capbrcup: capbrcup$1,
  capcap: capcap$1,
  cap: cap$1,
  Cap: Cap$1,
  capcup: capcup$1,
  capdot: capdot$1,
  CapitalDifferentialD: CapitalDifferentialD$1,
  caps: caps$1,
  caret: caret$1,
  caron: caron$1,
  Cayleys: Cayleys$1,
  ccaps: ccaps$1,
  Ccaron: Ccaron$1,
  ccaron: ccaron$1,
  Ccedil: Ccedil$3,
  ccedil: ccedil$3,
  Ccirc: Ccirc$1,
  ccirc: ccirc$1,
  Cconint: Cconint$1,
  ccups: ccups$1,
  ccupssm: ccupssm$1,
  Cdot: Cdot$1,
  cdot: cdot$1,
  cedil: cedil$3,
  Cedilla: Cedilla$1,
  cemptyv: cemptyv$1,
  cent: cent$3,
  centerdot: centerdot$1,
  CenterDot: CenterDot$1,
  cfr: cfr$1,
  Cfr: Cfr$1,
  CHcy: CHcy$1,
  chcy: chcy$1,
  check: check$1,
  checkmark: checkmark$1,
  Chi: Chi$1,
  chi: chi$1,
  circ: circ$1,
  circeq: circeq$1,
  circlearrowleft: circlearrowleft$1,
  circlearrowright: circlearrowright$1,
  circledast: circledast$1,
  circledcirc: circledcirc$1,
  circleddash: circleddash$1,
  CircleDot: CircleDot$1,
  circledR: circledR$1,
  circledS: circledS$1,
  CircleMinus: CircleMinus$1,
  CirclePlus: CirclePlus$1,
  CircleTimes: CircleTimes$1,
  cir: cir$1,
  cirE: cirE$1,
  cire: cire$1,
  cirfnint: cirfnint$1,
  cirmid: cirmid$1,
  cirscir: cirscir$1,
  ClockwiseContourIntegral: ClockwiseContourIntegral$1,
  CloseCurlyDoubleQuote: CloseCurlyDoubleQuote$1,
  CloseCurlyQuote: CloseCurlyQuote$1,
  clubs: clubs$1,
  clubsuit: clubsuit$1,
  colon: colon$1,
  Colon: Colon$1,
  Colone: Colone$1,
  colone: colone$1,
  coloneq: coloneq$1,
  comma: comma$1,
  commat: commat$1,
  comp: comp$1,
  compfn: compfn$1,
  complement: complement$1,
  complexes: complexes$1,
  cong: cong$1,
  congdot: congdot$1,
  Congruent: Congruent$1,
  conint: conint$1,
  Conint: Conint$1,
  ContourIntegral: ContourIntegral$1,
  copf: copf$1,
  Copf: Copf$1,
  coprod: coprod$1,
  Coproduct: Coproduct$1,
  copy: copy$3,
  COPY: COPY$3,
  copysr: copysr$1,
  CounterClockwiseContourIntegral: CounterClockwiseContourIntegral$1,
  crarr: crarr$1,
  cross: cross$1,
  Cross: Cross$1,
  Cscr: Cscr$1,
  cscr: cscr$1,
  csub: csub$1,
  csube: csube$1,
  csup: csup$1,
  csupe: csupe$1,
  ctdot: ctdot$1,
  cudarrl: cudarrl$1,
  cudarrr: cudarrr$1,
  cuepr: cuepr$1,
  cuesc: cuesc$1,
  cularr: cularr$1,
  cularrp: cularrp$1,
  cupbrcap: cupbrcap$1,
  cupcap: cupcap$1,
  CupCap: CupCap$1,
  cup: cup$1,
  Cup: Cup$1,
  cupcup: cupcup$1,
  cupdot: cupdot$1,
  cupor: cupor$1,
  cups: cups$1,
  curarr: curarr$1,
  curarrm: curarrm$1,
  curlyeqprec: curlyeqprec$1,
  curlyeqsucc: curlyeqsucc$1,
  curlyvee: curlyvee$1,
  curlywedge: curlywedge$1,
  curren: curren$3,
  curvearrowleft: curvearrowleft$1,
  curvearrowright: curvearrowright$1,
  cuvee: cuvee$1,
  cuwed: cuwed$1,
  cwconint: cwconint$1,
  cwint: cwint$1,
  cylcty: cylcty$1,
  dagger: dagger$1,
  Dagger: Dagger$1,
  daleth: daleth$1,
  darr: darr$1,
  Darr: Darr$1,
  dArr: dArr$1,
  dash: dash$1,
  Dashv: Dashv$1,
  dashv: dashv$1,
  dbkarow: dbkarow$1,
  dblac: dblac$1,
  Dcaron: Dcaron$1,
  dcaron: dcaron$1,
  Dcy: Dcy$1,
  dcy: dcy$1,
  ddagger: ddagger$1,
  ddarr: ddarr$1,
  DD: DD$1,
  dd: dd$1,
  DDotrahd: DDotrahd$1,
  ddotseq: ddotseq$1,
  deg: deg$3,
  Del: Del$1,
  Delta: Delta$1,
  delta: delta$1,
  demptyv: demptyv$1,
  dfisht: dfisht$1,
  Dfr: Dfr$1,
  dfr: dfr$1,
  dHar: dHar$1,
  dharl: dharl$1,
  dharr: dharr$1,
  DiacriticalAcute: DiacriticalAcute$1,
  DiacriticalDot: DiacriticalDot$1,
  DiacriticalDoubleAcute: DiacriticalDoubleAcute$1,
  DiacriticalGrave: DiacriticalGrave$1,
  DiacriticalTilde: DiacriticalTilde$1,
  diam: diam$1,
  diamond: diamond$1,
  Diamond: Diamond$1,
  diamondsuit: diamondsuit$1,
  diams: diams$1,
  die: die$1,
  DifferentialD: DifferentialD$1,
  digamma: digamma$1,
  disin: disin$1,
  div: div$1,
  divide: divide$3,
  divideontimes: divideontimes$1,
  divonx: divonx$1,
  DJcy: DJcy$1,
  djcy: djcy$1,
  dlcorn: dlcorn$1,
  dlcrop: dlcrop$1,
  dollar: dollar$1,
  Dopf: Dopf$1,
  dopf: dopf$1,
  Dot: Dot$1,
  dot: dot$1,
  DotDot: DotDot$1,
  doteq: doteq$1,
  doteqdot: doteqdot$1,
  DotEqual: DotEqual$1,
  dotminus: dotminus$1,
  dotplus: dotplus$1,
  dotsquare: dotsquare$1,
  doublebarwedge: doublebarwedge$1,
  DoubleContourIntegral: DoubleContourIntegral$1,
  DoubleDot: DoubleDot$1,
  DoubleDownArrow: DoubleDownArrow$1,
  DoubleLeftArrow: DoubleLeftArrow$1,
  DoubleLeftRightArrow: DoubleLeftRightArrow$1,
  DoubleLeftTee: DoubleLeftTee$1,
  DoubleLongLeftArrow: DoubleLongLeftArrow$1,
  DoubleLongLeftRightArrow: DoubleLongLeftRightArrow$1,
  DoubleLongRightArrow: DoubleLongRightArrow$1,
  DoubleRightArrow: DoubleRightArrow$1,
  DoubleRightTee: DoubleRightTee$1,
  DoubleUpArrow: DoubleUpArrow$1,
  DoubleUpDownArrow: DoubleUpDownArrow$1,
  DoubleVerticalBar: DoubleVerticalBar$1,
  DownArrowBar: DownArrowBar$1,
  downarrow: downarrow$1,
  DownArrow: DownArrow$1,
  Downarrow: Downarrow$1,
  DownArrowUpArrow: DownArrowUpArrow$1,
  DownBreve: DownBreve$1,
  downdownarrows: downdownarrows$1,
  downharpoonleft: downharpoonleft$1,
  downharpoonright: downharpoonright$1,
  DownLeftRightVector: DownLeftRightVector$1,
  DownLeftTeeVector: DownLeftTeeVector$1,
  DownLeftVectorBar: DownLeftVectorBar$1,
  DownLeftVector: DownLeftVector$1,
  DownRightTeeVector: DownRightTeeVector$1,
  DownRightVectorBar: DownRightVectorBar$1,
  DownRightVector: DownRightVector$1,
  DownTeeArrow: DownTeeArrow$1,
  DownTee: DownTee$1,
  drbkarow: drbkarow$1,
  drcorn: drcorn$1,
  drcrop: drcrop$1,
  Dscr: Dscr$1,
  dscr: dscr$1,
  DScy: DScy$1,
  dscy: dscy$1,
  dsol: dsol$1,
  Dstrok: Dstrok$1,
  dstrok: dstrok$1,
  dtdot: dtdot$1,
  dtri: dtri$1,
  dtrif: dtrif$1,
  duarr: duarr$1,
  duhar: duhar$1,
  dwangle: dwangle$1,
  DZcy: DZcy$1,
  dzcy: dzcy$1,
  dzigrarr: dzigrarr$1,
  Eacute: Eacute$3,
  eacute: eacute$3,
  easter: easter$1,
  Ecaron: Ecaron$1,
  ecaron: ecaron$1,
  Ecirc: Ecirc$3,
  ecirc: ecirc$3,
  ecir: ecir$1,
  ecolon: ecolon$1,
  Ecy: Ecy$1,
  ecy: ecy$1,
  eDDot: eDDot$1,
  Edot: Edot$1,
  edot: edot$1,
  eDot: eDot$1,
  ee: ee$1,
  efDot: efDot$1,
  Efr: Efr$1,
  efr: efr$1,
  eg: eg$1,
  Egrave: Egrave$3,
  egrave: egrave$3,
  egs: egs$1,
  egsdot: egsdot$1,
  el: el$1,
  Element: Element$1,
  elinters: elinters$1,
  ell: ell$1,
  els: els$1,
  elsdot: elsdot$1,
  Emacr: Emacr$1,
  emacr: emacr$1,
  empty: empty$1,
  emptyset: emptyset$1,
  EmptySmallSquare: EmptySmallSquare$1,
  emptyv: emptyv$1,
  EmptyVerySmallSquare: EmptyVerySmallSquare$1,
  emsp13: emsp13$1,
  emsp14: emsp14$1,
  emsp: emsp$1,
  ENG: ENG$1,
  eng: eng$1,
  ensp: ensp$1,
  Eogon: Eogon$1,
  eogon: eogon$1,
  Eopf: Eopf$1,
  eopf: eopf$1,
  epar: epar$1,
  eparsl: eparsl$1,
  eplus: eplus$1,
  epsi: epsi$1,
  Epsilon: Epsilon$1,
  epsilon: epsilon$1,
  epsiv: epsiv$1,
  eqcirc: eqcirc$1,
  eqcolon: eqcolon$1,
  eqsim: eqsim$1,
  eqslantgtr: eqslantgtr$1,
  eqslantless: eqslantless$1,
  Equal: Equal$1,
  equals: equals$1,
  EqualTilde: EqualTilde$1,
  equest: equest$1,
  Equilibrium: Equilibrium$1,
  equiv: equiv$1,
  equivDD: equivDD$1,
  eqvparsl: eqvparsl$1,
  erarr: erarr$1,
  erDot: erDot$1,
  escr: escr$1,
  Escr: Escr$1,
  esdot: esdot$1,
  Esim: Esim$1,
  esim: esim$1,
  Eta: Eta$1,
  eta: eta$1,
  ETH: ETH$3,
  eth: eth$3,
  Euml: Euml$3,
  euml: euml$3,
  euro: euro$1,
  excl: excl$1,
  exist: exist$1,
  Exists: Exists$1,
  expectation: expectation$1,
  exponentiale: exponentiale$1,
  ExponentialE: ExponentialE$1,
  fallingdotseq: fallingdotseq$1,
  Fcy: Fcy$1,
  fcy: fcy$1,
  female: female$1,
  ffilig: ffilig$1,
  fflig: fflig$1,
  ffllig: ffllig$1,
  Ffr: Ffr$1,
  ffr: ffr$1,
  filig: filig$1,
  FilledSmallSquare: FilledSmallSquare$1,
  FilledVerySmallSquare: FilledVerySmallSquare$1,
  fjlig: fjlig$1,
  flat: flat$1,
  fllig: fllig$1,
  fltns: fltns$1,
  fnof: fnof$1,
  Fopf: Fopf$1,
  fopf: fopf$1,
  forall: forall$1,
  ForAll: ForAll$1,
  fork: fork$1,
  forkv: forkv$1,
  Fouriertrf: Fouriertrf$1,
  fpartint: fpartint$1,
  frac12: frac12$3,
  frac13: frac13$1,
  frac14: frac14$3,
  frac15: frac15$1,
  frac16: frac16$1,
  frac18: frac18$1,
  frac23: frac23$1,
  frac25: frac25$1,
  frac34: frac34$3,
  frac35: frac35$1,
  frac38: frac38$1,
  frac45: frac45$1,
  frac56: frac56$1,
  frac58: frac58$1,
  frac78: frac78$1,
  frasl: frasl$1,
  frown: frown$1,
  fscr: fscr$1,
  Fscr: Fscr$1,
  gacute: gacute$1,
  Gamma: Gamma$1,
  gamma: gamma$1,
  Gammad: Gammad$1,
  gammad: gammad$1,
  gap: gap$1,
  Gbreve: Gbreve$1,
  gbreve: gbreve$1,
  Gcedil: Gcedil$1,
  Gcirc: Gcirc$1,
  gcirc: gcirc$1,
  Gcy: Gcy$1,
  gcy: gcy$1,
  Gdot: Gdot$1,
  gdot: gdot$1,
  ge: ge$1,
  gE: gE$1,
  gEl: gEl$1,
  gel: gel$1,
  geq: geq$1,
  geqq: geqq$1,
  geqslant: geqslant$1,
  gescc: gescc$1,
  ges: ges$1,
  gesdot: gesdot$1,
  gesdoto: gesdoto$1,
  gesdotol: gesdotol$1,
  gesl: gesl$1,
  gesles: gesles$1,
  Gfr: Gfr$1,
  gfr: gfr$1,
  gg: gg$1,
  Gg: Gg$1,
  ggg: ggg$1,
  gimel: gimel$1,
  GJcy: GJcy$1,
  gjcy: gjcy$1,
  gla: gla$1,
  gl: gl$1,
  glE: glE$1,
  glj: glj$1,
  gnap: gnap$1,
  gnapprox: gnapprox$1,
  gne: gne$1,
  gnE: gnE$1,
  gneq: gneq$1,
  gneqq: gneqq$1,
  gnsim: gnsim$1,
  Gopf: Gopf$1,
  gopf: gopf$1,
  grave: grave$1,
  GreaterEqual: GreaterEqual$1,
  GreaterEqualLess: GreaterEqualLess$1,
  GreaterFullEqual: GreaterFullEqual$1,
  GreaterGreater: GreaterGreater$1,
  GreaterLess: GreaterLess$1,
  GreaterSlantEqual: GreaterSlantEqual$1,
  GreaterTilde: GreaterTilde$1,
  Gscr: Gscr$1,
  gscr: gscr$1,
  gsim: gsim$1,
  gsime: gsime$1,
  gsiml: gsiml$1,
  gtcc: gtcc$1,
  gtcir: gtcir$1,
  gt: gt$5,
  GT: GT$3,
  Gt: Gt$1,
  gtdot: gtdot$1,
  gtlPar: gtlPar$1,
  gtquest: gtquest$1,
  gtrapprox: gtrapprox$1,
  gtrarr: gtrarr$1,
  gtrdot: gtrdot$1,
  gtreqless: gtreqless$1,
  gtreqqless: gtreqqless$1,
  gtrless: gtrless$1,
  gtrsim: gtrsim$1,
  gvertneqq: gvertneqq$1,
  gvnE: gvnE$1,
  Hacek: Hacek$1,
  hairsp: hairsp$1,
  half: half$1,
  hamilt: hamilt$1,
  HARDcy: HARDcy$1,
  hardcy: hardcy$1,
  harrcir: harrcir$1,
  harr: harr$1,
  hArr: hArr$1,
  harrw: harrw$1,
  Hat: Hat$1,
  hbar: hbar$1,
  Hcirc: Hcirc$1,
  hcirc: hcirc$1,
  hearts: hearts$1,
  heartsuit: heartsuit$1,
  hellip: hellip$1,
  hercon: hercon$1,
  hfr: hfr$1,
  Hfr: Hfr$1,
  HilbertSpace: HilbertSpace$1,
  hksearow: hksearow$1,
  hkswarow: hkswarow$1,
  hoarr: hoarr$1,
  homtht: homtht$1,
  hookleftarrow: hookleftarrow$1,
  hookrightarrow: hookrightarrow$1,
  hopf: hopf$1,
  Hopf: Hopf$1,
  horbar: horbar$1,
  HorizontalLine: HorizontalLine$1,
  hscr: hscr$1,
  Hscr: Hscr$1,
  hslash: hslash$1,
  Hstrok: Hstrok$1,
  hstrok: hstrok$1,
  HumpDownHump: HumpDownHump$1,
  HumpEqual: HumpEqual$1,
  hybull: hybull$1,
  hyphen: hyphen$1,
  Iacute: Iacute$3,
  iacute: iacute$3,
  ic: ic$1,
  Icirc: Icirc$3,
  icirc: icirc$3,
  Icy: Icy$1,
  icy: icy$1,
  Idot: Idot$1,
  IEcy: IEcy$1,
  iecy: iecy$1,
  iexcl: iexcl$3,
  iff: iff$1,
  ifr: ifr$1,
  Ifr: Ifr$1,
  Igrave: Igrave$3,
  igrave: igrave$3,
  ii: ii$1,
  iiiint: iiiint$1,
  iiint: iiint$1,
  iinfin: iinfin$1,
  iiota: iiota$1,
  IJlig: IJlig$1,
  ijlig: ijlig$1,
  Imacr: Imacr$1,
  imacr: imacr$1,
  image: image$1,
  ImaginaryI: ImaginaryI$1,
  imagline: imagline$1,
  imagpart: imagpart$1,
  imath: imath$1,
  Im: Im$1,
  imof: imof$1,
  imped: imped$1,
  Implies: Implies$1,
  incare: incare$1,
  "in": "\u2208",
  infin: infin$1,
  infintie: infintie$1,
  inodot: inodot$1,
  intcal: intcal$1,
  int: int$1,
  Int: Int$1,
  integers: integers$1,
  Integral: Integral$1,
  intercal: intercal$1,
  Intersection: Intersection$1,
  intlarhk: intlarhk$1,
  intprod: intprod$1,
  InvisibleComma: InvisibleComma$1,
  InvisibleTimes: InvisibleTimes$1,
  IOcy: IOcy$1,
  iocy: iocy$1,
  Iogon: Iogon$1,
  iogon: iogon$1,
  Iopf: Iopf$1,
  iopf: iopf$1,
  Iota: Iota$1,
  iota: iota$1,
  iprod: iprod$1,
  iquest: iquest$3,
  iscr: iscr$1,
  Iscr: Iscr$1,
  isin: isin$1,
  isindot: isindot$1,
  isinE: isinE$1,
  isins: isins$1,
  isinsv: isinsv$1,
  isinv: isinv$1,
  it: it$1,
  Itilde: Itilde$1,
  itilde: itilde$1,
  Iukcy: Iukcy$1,
  iukcy: iukcy$1,
  Iuml: Iuml$3,
  iuml: iuml$3,
  Jcirc: Jcirc$1,
  jcirc: jcirc$1,
  Jcy: Jcy$1,
  jcy: jcy$1,
  Jfr: Jfr$1,
  jfr: jfr$1,
  jmath: jmath$1,
  Jopf: Jopf$1,
  jopf: jopf$1,
  Jscr: Jscr$1,
  jscr: jscr$1,
  Jsercy: Jsercy$1,
  jsercy: jsercy$1,
  Jukcy: Jukcy$1,
  jukcy: jukcy$1,
  Kappa: Kappa$1,
  kappa: kappa$1,
  kappav: kappav$1,
  Kcedil: Kcedil$1,
  kcedil: kcedil$1,
  Kcy: Kcy$1,
  kcy: kcy$1,
  Kfr: Kfr$1,
  kfr: kfr$1,
  kgreen: kgreen$1,
  KHcy: KHcy$1,
  khcy: khcy$1,
  KJcy: KJcy$1,
  kjcy: kjcy$1,
  Kopf: Kopf$1,
  kopf: kopf$1,
  Kscr: Kscr$1,
  kscr: kscr$1,
  lAarr: lAarr$1,
  Lacute: Lacute$1,
  lacute: lacute$1,
  laemptyv: laemptyv$1,
  lagran: lagran$1,
  Lambda: Lambda$1,
  lambda: lambda$1,
  lang: lang$1,
  Lang: Lang$1,
  langd: langd$1,
  langle: langle$1,
  lap: lap$1,
  Laplacetrf: Laplacetrf$1,
  laquo: laquo$3,
  larrb: larrb$1,
  larrbfs: larrbfs$1,
  larr: larr$1,
  Larr: Larr$1,
  lArr: lArr$1,
  larrfs: larrfs$1,
  larrhk: larrhk$1,
  larrlp: larrlp$1,
  larrpl: larrpl$1,
  larrsim: larrsim$1,
  larrtl: larrtl$1,
  latail: latail$1,
  lAtail: lAtail$1,
  lat: lat$1,
  late: late$1,
  lates: lates$1,
  lbarr: lbarr$1,
  lBarr: lBarr$1,
  lbbrk: lbbrk$1,
  lbrace: lbrace$1,
  lbrack: lbrack$1,
  lbrke: lbrke$1,
  lbrksld: lbrksld$1,
  lbrkslu: lbrkslu$1,
  Lcaron: Lcaron$1,
  lcaron: lcaron$1,
  Lcedil: Lcedil$1,
  lcedil: lcedil$1,
  lceil: lceil$1,
  lcub: lcub$1,
  Lcy: Lcy$1,
  lcy: lcy$1,
  ldca: ldca$1,
  ldquo: ldquo$1,
  ldquor: ldquor$1,
  ldrdhar: ldrdhar$1,
  ldrushar: ldrushar$1,
  ldsh: ldsh$1,
  le: le$1,
  lE: lE$1,
  LeftAngleBracket: LeftAngleBracket$1,
  LeftArrowBar: LeftArrowBar$1,
  leftarrow: leftarrow$1,
  LeftArrow: LeftArrow$1,
  Leftarrow: Leftarrow$1,
  LeftArrowRightArrow: LeftArrowRightArrow$1,
  leftarrowtail: leftarrowtail$1,
  LeftCeiling: LeftCeiling$1,
  LeftDoubleBracket: LeftDoubleBracket$1,
  LeftDownTeeVector: LeftDownTeeVector$1,
  LeftDownVectorBar: LeftDownVectorBar$1,
  LeftDownVector: LeftDownVector$1,
  LeftFloor: LeftFloor$1,
  leftharpoondown: leftharpoondown$1,
  leftharpoonup: leftharpoonup$1,
  leftleftarrows: leftleftarrows$1,
  leftrightarrow: leftrightarrow$1,
  LeftRightArrow: LeftRightArrow$1,
  Leftrightarrow: Leftrightarrow$1,
  leftrightarrows: leftrightarrows$1,
  leftrightharpoons: leftrightharpoons$1,
  leftrightsquigarrow: leftrightsquigarrow$1,
  LeftRightVector: LeftRightVector$1,
  LeftTeeArrow: LeftTeeArrow$1,
  LeftTee: LeftTee$1,
  LeftTeeVector: LeftTeeVector$1,
  leftthreetimes: leftthreetimes$1,
  LeftTriangleBar: LeftTriangleBar$1,
  LeftTriangle: LeftTriangle$1,
  LeftTriangleEqual: LeftTriangleEqual$1,
  LeftUpDownVector: LeftUpDownVector$1,
  LeftUpTeeVector: LeftUpTeeVector$1,
  LeftUpVectorBar: LeftUpVectorBar$1,
  LeftUpVector: LeftUpVector$1,
  LeftVectorBar: LeftVectorBar$1,
  LeftVector: LeftVector$1,
  lEg: lEg$1,
  leg: leg$1,
  leq: leq$1,
  leqq: leqq$1,
  leqslant: leqslant$1,
  lescc: lescc$1,
  les: les$1,
  lesdot: lesdot$1,
  lesdoto: lesdoto$1,
  lesdotor: lesdotor$1,
  lesg: lesg$1,
  lesges: lesges$1,
  lessapprox: lessapprox$1,
  lessdot: lessdot$1,
  lesseqgtr: lesseqgtr$1,
  lesseqqgtr: lesseqqgtr$1,
  LessEqualGreater: LessEqualGreater$1,
  LessFullEqual: LessFullEqual$1,
  LessGreater: LessGreater$1,
  lessgtr: lessgtr$1,
  LessLess: LessLess$1,
  lesssim: lesssim$1,
  LessSlantEqual: LessSlantEqual$1,
  LessTilde: LessTilde$1,
  lfisht: lfisht$1,
  lfloor: lfloor$1,
  Lfr: Lfr$1,
  lfr: lfr$1,
  lg: lg$1,
  lgE: lgE$1,
  lHar: lHar$1,
  lhard: lhard$1,
  lharu: lharu$1,
  lharul: lharul$1,
  lhblk: lhblk$1,
  LJcy: LJcy$1,
  ljcy: ljcy$1,
  llarr: llarr$1,
  ll: ll$1,
  Ll: Ll$1,
  llcorner: llcorner$1,
  Lleftarrow: Lleftarrow$1,
  llhard: llhard$1,
  lltri: lltri$1,
  Lmidot: Lmidot$1,
  lmidot: lmidot$1,
  lmoustache: lmoustache$1,
  lmoust: lmoust$1,
  lnap: lnap$1,
  lnapprox: lnapprox$1,
  lne: lne$1,
  lnE: lnE$1,
  lneq: lneq$1,
  lneqq: lneqq$1,
  lnsim: lnsim$1,
  loang: loang$1,
  loarr: loarr$1,
  lobrk: lobrk$1,
  longleftarrow: longleftarrow$1,
  LongLeftArrow: LongLeftArrow$1,
  Longleftarrow: Longleftarrow$1,
  longleftrightarrow: longleftrightarrow$1,
  LongLeftRightArrow: LongLeftRightArrow$1,
  Longleftrightarrow: Longleftrightarrow$1,
  longmapsto: longmapsto$1,
  longrightarrow: longrightarrow$1,
  LongRightArrow: LongRightArrow$1,
  Longrightarrow: Longrightarrow$1,
  looparrowleft: looparrowleft$1,
  looparrowright: looparrowright$1,
  lopar: lopar$1,
  Lopf: Lopf$1,
  lopf: lopf$1,
  loplus: loplus$1,
  lotimes: lotimes$1,
  lowast: lowast$1,
  lowbar: lowbar$1,
  LowerLeftArrow: LowerLeftArrow$1,
  LowerRightArrow: LowerRightArrow$1,
  loz: loz$1,
  lozenge: lozenge$1,
  lozf: lozf$1,
  lpar: lpar$1,
  lparlt: lparlt$1,
  lrarr: lrarr$1,
  lrcorner: lrcorner$1,
  lrhar: lrhar$1,
  lrhard: lrhard$1,
  lrm: lrm$1,
  lrtri: lrtri$1,
  lsaquo: lsaquo$1,
  lscr: lscr$1,
  Lscr: Lscr$1,
  lsh: lsh$1,
  Lsh: Lsh$1,
  lsim: lsim$1,
  lsime: lsime$1,
  lsimg: lsimg$1,
  lsqb: lsqb$1,
  lsquo: lsquo$1,
  lsquor: lsquor$1,
  Lstrok: Lstrok$1,
  lstrok: lstrok$1,
  ltcc: ltcc$1,
  ltcir: ltcir$1,
  lt: lt$5,
  LT: LT$3,
  Lt: Lt$1,
  ltdot: ltdot$1,
  lthree: lthree$1,
  ltimes: ltimes$1,
  ltlarr: ltlarr$1,
  ltquest: ltquest$1,
  ltri: ltri$1,
  ltrie: ltrie$1,
  ltrif: ltrif$1,
  ltrPar: ltrPar$1,
  lurdshar: lurdshar$1,
  luruhar: luruhar$1,
  lvertneqq: lvertneqq$1,
  lvnE: lvnE$1,
  macr: macr$3,
  male: male$1,
  malt: malt$1,
  maltese: maltese$1,
  "Map": "\u2905",
  map: map$1,
  mapsto: mapsto$1,
  mapstodown: mapstodown$1,
  mapstoleft: mapstoleft$1,
  mapstoup: mapstoup$1,
  marker: marker$1,
  mcomma: mcomma$1,
  Mcy: Mcy$1,
  mcy: mcy$1,
  mdash: mdash$1,
  mDDot: mDDot$1,
  measuredangle: measuredangle$1,
  MediumSpace: MediumSpace$1,
  Mellintrf: Mellintrf$1,
  Mfr: Mfr$1,
  mfr: mfr$1,
  mho: mho$1,
  micro: micro$3,
  midast: midast$1,
  midcir: midcir$1,
  mid: mid$1,
  middot: middot$3,
  minusb: minusb$1,
  minus: minus$1,
  minusd: minusd$1,
  minusdu: minusdu$1,
  MinusPlus: MinusPlus$1,
  mlcp: mlcp$1,
  mldr: mldr$1,
  mnplus: mnplus$1,
  models: models$1,
  Mopf: Mopf$1,
  mopf: mopf$1,
  mp: mp$1,
  mscr: mscr$1,
  Mscr: Mscr$1,
  mstpos: mstpos$1,
  Mu: Mu$1,
  mu: mu$1,
  multimap: multimap$1,
  mumap: mumap$1,
  nabla: nabla$1,
  Nacute: Nacute$1,
  nacute: nacute$1,
  nang: nang$1,
  nap: nap$1,
  napE: napE$1,
  napid: napid$1,
  napos: napos$1,
  napprox: napprox$1,
  natural: natural$1,
  naturals: naturals$1,
  natur: natur$1,
  nbsp: nbsp$3,
  nbump: nbump$1,
  nbumpe: nbumpe$1,
  ncap: ncap$1,
  Ncaron: Ncaron$1,
  ncaron: ncaron$1,
  Ncedil: Ncedil$1,
  ncedil: ncedil$1,
  ncong: ncong$1,
  ncongdot: ncongdot$1,
  ncup: ncup$1,
  Ncy: Ncy$1,
  ncy: ncy$1,
  ndash: ndash$1,
  nearhk: nearhk$1,
  nearr: nearr$1,
  neArr: neArr$1,
  nearrow: nearrow$1,
  ne: ne$1,
  nedot: nedot$1,
  NegativeMediumSpace: NegativeMediumSpace$1,
  NegativeThickSpace: NegativeThickSpace$1,
  NegativeThinSpace: NegativeThinSpace$1,
  NegativeVeryThinSpace: NegativeVeryThinSpace$1,
  nequiv: nequiv$1,
  nesear: nesear$1,
  nesim: nesim$1,
  NestedGreaterGreater: NestedGreaterGreater$1,
  NestedLessLess: NestedLessLess$1,
  NewLine: NewLine$1,
  nexist: nexist$1,
  nexists: nexists$1,
  Nfr: Nfr$1,
  nfr: nfr$1,
  ngE: ngE$1,
  nge: nge$1,
  ngeq: ngeq$1,
  ngeqq: ngeqq$1,
  ngeqslant: ngeqslant$1,
  nges: nges$1,
  nGg: nGg$1,
  ngsim: ngsim$1,
  nGt: nGt$1,
  ngt: ngt$1,
  ngtr: ngtr$1,
  nGtv: nGtv$1,
  nharr: nharr$1,
  nhArr: nhArr$1,
  nhpar: nhpar$1,
  ni: ni$1,
  nis: nis$1,
  nisd: nisd$1,
  niv: niv$1,
  NJcy: NJcy$1,
  njcy: njcy$1,
  nlarr: nlarr$1,
  nlArr: nlArr$1,
  nldr: nldr$1,
  nlE: nlE$1,
  nle: nle$1,
  nleftarrow: nleftarrow$1,
  nLeftarrow: nLeftarrow$1,
  nleftrightarrow: nleftrightarrow$1,
  nLeftrightarrow: nLeftrightarrow$1,
  nleq: nleq$1,
  nleqq: nleqq$1,
  nleqslant: nleqslant$1,
  nles: nles$1,
  nless: nless$1,
  nLl: nLl$1,
  nlsim: nlsim$1,
  nLt: nLt$1,
  nlt: nlt$1,
  nltri: nltri$1,
  nltrie: nltrie$1,
  nLtv: nLtv$1,
  nmid: nmid$1,
  NoBreak: NoBreak$1,
  NonBreakingSpace: NonBreakingSpace$1,
  nopf: nopf$1,
  Nopf: Nopf$1,
  Not: Not$1,
  not: not$3,
  NotCongruent: NotCongruent$1,
  NotCupCap: NotCupCap$1,
  NotDoubleVerticalBar: NotDoubleVerticalBar$1,
  NotElement: NotElement$1,
  NotEqual: NotEqual$1,
  NotEqualTilde: NotEqualTilde$1,
  NotExists: NotExists$1,
  NotGreater: NotGreater$1,
  NotGreaterEqual: NotGreaterEqual$1,
  NotGreaterFullEqual: NotGreaterFullEqual$1,
  NotGreaterGreater: NotGreaterGreater$1,
  NotGreaterLess: NotGreaterLess$1,
  NotGreaterSlantEqual: NotGreaterSlantEqual$1,
  NotGreaterTilde: NotGreaterTilde$1,
  NotHumpDownHump: NotHumpDownHump$1,
  NotHumpEqual: NotHumpEqual$1,
  notin: notin$1,
  notindot: notindot$1,
  notinE: notinE$1,
  notinva: notinva$1,
  notinvb: notinvb$1,
  notinvc: notinvc$1,
  NotLeftTriangleBar: NotLeftTriangleBar$1,
  NotLeftTriangle: NotLeftTriangle$1,
  NotLeftTriangleEqual: NotLeftTriangleEqual$1,
  NotLess: NotLess$1,
  NotLessEqual: NotLessEqual$1,
  NotLessGreater: NotLessGreater$1,
  NotLessLess: NotLessLess$1,
  NotLessSlantEqual: NotLessSlantEqual$1,
  NotLessTilde: NotLessTilde$1,
  NotNestedGreaterGreater: NotNestedGreaterGreater$1,
  NotNestedLessLess: NotNestedLessLess$1,
  notni: notni$1,
  notniva: notniva$1,
  notnivb: notnivb$1,
  notnivc: notnivc$1,
  NotPrecedes: NotPrecedes$1,
  NotPrecedesEqual: NotPrecedesEqual$1,
  NotPrecedesSlantEqual: NotPrecedesSlantEqual$1,
  NotReverseElement: NotReverseElement$1,
  NotRightTriangleBar: NotRightTriangleBar$1,
  NotRightTriangle: NotRightTriangle$1,
  NotRightTriangleEqual: NotRightTriangleEqual$1,
  NotSquareSubset: NotSquareSubset$1,
  NotSquareSubsetEqual: NotSquareSubsetEqual$1,
  NotSquareSuperset: NotSquareSuperset$1,
  NotSquareSupersetEqual: NotSquareSupersetEqual$1,
  NotSubset: NotSubset$1,
  NotSubsetEqual: NotSubsetEqual$1,
  NotSucceeds: NotSucceeds$1,
  NotSucceedsEqual: NotSucceedsEqual$1,
  NotSucceedsSlantEqual: NotSucceedsSlantEqual$1,
  NotSucceedsTilde: NotSucceedsTilde$1,
  NotSuperset: NotSuperset$1,
  NotSupersetEqual: NotSupersetEqual$1,
  NotTilde: NotTilde$1,
  NotTildeEqual: NotTildeEqual$1,
  NotTildeFullEqual: NotTildeFullEqual$1,
  NotTildeTilde: NotTildeTilde$1,
  NotVerticalBar: NotVerticalBar$1,
  nparallel: nparallel$1,
  npar: npar$1,
  nparsl: nparsl$1,
  npart: npart$1,
  npolint: npolint$1,
  npr: npr$1,
  nprcue: nprcue$1,
  nprec: nprec$1,
  npreceq: npreceq$1,
  npre: npre$1,
  nrarrc: nrarrc$1,
  nrarr: nrarr$1,
  nrArr: nrArr$1,
  nrarrw: nrarrw$1,
  nrightarrow: nrightarrow$1,
  nRightarrow: nRightarrow$1,
  nrtri: nrtri$1,
  nrtrie: nrtrie$1,
  nsc: nsc$1,
  nsccue: nsccue$1,
  nsce: nsce$1,
  Nscr: Nscr$1,
  nscr: nscr$1,
  nshortmid: nshortmid$1,
  nshortparallel: nshortparallel$1,
  nsim: nsim$1,
  nsime: nsime$1,
  nsimeq: nsimeq$1,
  nsmid: nsmid$1,
  nspar: nspar$1,
  nsqsube: nsqsube$1,
  nsqsupe: nsqsupe$1,
  nsub: nsub$1,
  nsubE: nsubE$1,
  nsube: nsube$1,
  nsubset: nsubset$1,
  nsubseteq: nsubseteq$1,
  nsubseteqq: nsubseteqq$1,
  nsucc: nsucc$1,
  nsucceq: nsucceq$1,
  nsup: nsup$1,
  nsupE: nsupE$1,
  nsupe: nsupe$1,
  nsupset: nsupset$1,
  nsupseteq: nsupseteq$1,
  nsupseteqq: nsupseteqq$1,
  ntgl: ntgl$1,
  Ntilde: Ntilde$3,
  ntilde: ntilde$3,
  ntlg: ntlg$1,
  ntriangleleft: ntriangleleft$1,
  ntrianglelefteq: ntrianglelefteq$1,
  ntriangleright: ntriangleright$1,
  ntrianglerighteq: ntrianglerighteq$1,
  Nu: Nu$1,
  nu: nu$1,
  num: num$1,
  numero: numero$1,
  numsp: numsp$1,
  nvap: nvap$1,
  nvdash: nvdash$1,
  nvDash: nvDash$1,
  nVdash: nVdash$1,
  nVDash: nVDash$1,
  nvge: nvge$1,
  nvgt: nvgt$1,
  nvHarr: nvHarr$1,
  nvinfin: nvinfin$1,
  nvlArr: nvlArr$1,
  nvle: nvle$1,
  nvlt: nvlt$1,
  nvltrie: nvltrie$1,
  nvrArr: nvrArr$1,
  nvrtrie: nvrtrie$1,
  nvsim: nvsim$1,
  nwarhk: nwarhk$1,
  nwarr: nwarr$1,
  nwArr: nwArr$1,
  nwarrow: nwarrow$1,
  nwnear: nwnear$1,
  Oacute: Oacute$3,
  oacute: oacute$3,
  oast: oast$1,
  Ocirc: Ocirc$3,
  ocirc: ocirc$3,
  ocir: ocir$1,
  Ocy: Ocy$1,
  ocy: ocy$1,
  odash: odash$1,
  Odblac: Odblac$1,
  odblac: odblac$1,
  odiv: odiv$1,
  odot: odot$1,
  odsold: odsold$1,
  OElig: OElig$1,
  oelig: oelig$1,
  ofcir: ofcir$1,
  Ofr: Ofr$1,
  ofr: ofr$1,
  ogon: ogon$1,
  Ograve: Ograve$3,
  ograve: ograve$3,
  ogt: ogt$1,
  ohbar: ohbar$1,
  ohm: ohm$1,
  oint: oint$1,
  olarr: olarr$1,
  olcir: olcir$1,
  olcross: olcross$1,
  oline: oline$1,
  olt: olt$1,
  Omacr: Omacr$1,
  omacr: omacr$1,
  Omega: Omega$1,
  omega: omega$1,
  Omicron: Omicron$1,
  omicron: omicron$1,
  omid: omid$1,
  ominus: ominus$1,
  Oopf: Oopf$1,
  oopf: oopf$1,
  opar: opar$1,
  OpenCurlyDoubleQuote: OpenCurlyDoubleQuote$1,
  OpenCurlyQuote: OpenCurlyQuote$1,
  operp: operp$1,
  oplus: oplus$1,
  orarr: orarr$1,
  Or: Or$1,
  or: or$1,
  ord: ord$1,
  order: order$1,
  orderof: orderof$1,
  ordf: ordf$3,
  ordm: ordm$3,
  origof: origof$1,
  oror: oror$1,
  orslope: orslope$1,
  orv: orv$1,
  oS: oS$1,
  Oscr: Oscr$1,
  oscr: oscr$1,
  Oslash: Oslash$3,
  oslash: oslash$3,
  osol: osol$1,
  Otilde: Otilde$3,
  otilde: otilde$3,
  otimesas: otimesas$1,
  Otimes: Otimes$1,
  otimes: otimes$1,
  Ouml: Ouml$3,
  ouml: ouml$3,
  ovbar: ovbar$1,
  OverBar: OverBar$1,
  OverBrace: OverBrace$1,
  OverBracket: OverBracket$1,
  OverParenthesis: OverParenthesis$1,
  para: para$3,
  parallel: parallel$1,
  par: par$1,
  parsim: parsim$1,
  parsl: parsl$1,
  part: part$1,
  PartialD: PartialD$1,
  Pcy: Pcy$1,
  pcy: pcy$1,
  percnt: percnt$1,
  period: period$1,
  permil: permil$1,
  perp: perp$1,
  pertenk: pertenk$1,
  Pfr: Pfr$1,
  pfr: pfr$1,
  Phi: Phi$1,
  phi: phi$1,
  phiv: phiv$1,
  phmmat: phmmat$1,
  phone: phone$1,
  Pi: Pi$1,
  pi: pi$1,
  pitchfork: pitchfork$1,
  piv: piv$1,
  planck: planck$1,
  planckh: planckh$1,
  plankv: plankv$1,
  plusacir: plusacir$1,
  plusb: plusb$1,
  pluscir: pluscir$1,
  plus: plus$1,
  plusdo: plusdo$1,
  plusdu: plusdu$1,
  pluse: pluse$1,
  PlusMinus: PlusMinus$1,
  plusmn: plusmn$3,
  plussim: plussim$1,
  plustwo: plustwo$1,
  pm: pm$1,
  Poincareplane: Poincareplane$1,
  pointint: pointint$1,
  popf: popf$1,
  Popf: Popf$1,
  pound: pound$3,
  prap: prap$1,
  Pr: Pr$1,
  pr: pr$1,
  prcue: prcue$1,
  precapprox: precapprox$1,
  prec: prec$1,
  preccurlyeq: preccurlyeq$1,
  Precedes: Precedes$1,
  PrecedesEqual: PrecedesEqual$1,
  PrecedesSlantEqual: PrecedesSlantEqual$1,
  PrecedesTilde: PrecedesTilde$1,
  preceq: preceq$1,
  precnapprox: precnapprox$1,
  precneqq: precneqq$1,
  precnsim: precnsim$1,
  pre: pre$1,
  prE: prE$1,
  precsim: precsim$1,
  prime: prime$1,
  Prime: Prime$1,
  primes: primes$1,
  prnap: prnap$1,
  prnE: prnE$1,
  prnsim: prnsim$1,
  prod: prod$1,
  Product: Product$1,
  profalar: profalar$1,
  profline: profline$1,
  profsurf: profsurf$1,
  prop: prop$1,
  Proportional: Proportional$1,
  Proportion: Proportion$1,
  propto: propto$1,
  prsim: prsim$1,
  prurel: prurel$1,
  Pscr: Pscr$1,
  pscr: pscr$1,
  Psi: Psi$1,
  psi: psi$1,
  puncsp: puncsp$1,
  Qfr: Qfr$1,
  qfr: qfr$1,
  qint: qint$1,
  qopf: qopf$1,
  Qopf: Qopf$1,
  qprime: qprime$1,
  Qscr: Qscr$1,
  qscr: qscr$1,
  quaternions: quaternions$1,
  quatint: quatint$1,
  quest: quest$1,
  questeq: questeq$1,
  quot: quot$5,
  QUOT: QUOT$3,
  rAarr: rAarr$1,
  race: race$1,
  Racute: Racute$1,
  racute: racute$1,
  radic: radic$1,
  raemptyv: raemptyv$1,
  rang: rang$1,
  Rang: Rang$1,
  rangd: rangd$1,
  range: range$1,
  rangle: rangle$1,
  raquo: raquo$3,
  rarrap: rarrap$1,
  rarrb: rarrb$1,
  rarrbfs: rarrbfs$1,
  rarrc: rarrc$1,
  rarr: rarr$1,
  Rarr: Rarr$1,
  rArr: rArr$1,
  rarrfs: rarrfs$1,
  rarrhk: rarrhk$1,
  rarrlp: rarrlp$1,
  rarrpl: rarrpl$1,
  rarrsim: rarrsim$1,
  Rarrtl: Rarrtl$1,
  rarrtl: rarrtl$1,
  rarrw: rarrw$1,
  ratail: ratail$1,
  rAtail: rAtail$1,
  ratio: ratio$1,
  rationals: rationals$1,
  rbarr: rbarr$1,
  rBarr: rBarr$1,
  RBarr: RBarr$1,
  rbbrk: rbbrk$1,
  rbrace: rbrace$1,
  rbrack: rbrack$1,
  rbrke: rbrke$1,
  rbrksld: rbrksld$1,
  rbrkslu: rbrkslu$1,
  Rcaron: Rcaron$1,
  rcaron: rcaron$1,
  Rcedil: Rcedil$1,
  rcedil: rcedil$1,
  rceil: rceil$1,
  rcub: rcub$1,
  Rcy: Rcy$1,
  rcy: rcy$1,
  rdca: rdca$1,
  rdldhar: rdldhar$1,
  rdquo: rdquo$1,
  rdquor: rdquor$1,
  rdsh: rdsh$1,
  real: real$1,
  realine: realine$1,
  realpart: realpart$1,
  reals: reals$1,
  Re: Re$1,
  rect: rect$1,
  reg: reg$3,
  REG: REG$3,
  ReverseElement: ReverseElement$1,
  ReverseEquilibrium: ReverseEquilibrium$1,
  ReverseUpEquilibrium: ReverseUpEquilibrium$1,
  rfisht: rfisht$1,
  rfloor: rfloor$1,
  rfr: rfr$1,
  Rfr: Rfr$1,
  rHar: rHar$1,
  rhard: rhard$1,
  rharu: rharu$1,
  rharul: rharul$1,
  Rho: Rho$1,
  rho: rho$1,
  rhov: rhov$1,
  RightAngleBracket: RightAngleBracket$1,
  RightArrowBar: RightArrowBar$1,
  rightarrow: rightarrow$1,
  RightArrow: RightArrow$1,
  Rightarrow: Rightarrow$1,
  RightArrowLeftArrow: RightArrowLeftArrow$1,
  rightarrowtail: rightarrowtail$1,
  RightCeiling: RightCeiling$1,
  RightDoubleBracket: RightDoubleBracket$1,
  RightDownTeeVector: RightDownTeeVector$1,
  RightDownVectorBar: RightDownVectorBar$1,
  RightDownVector: RightDownVector$1,
  RightFloor: RightFloor$1,
  rightharpoondown: rightharpoondown$1,
  rightharpoonup: rightharpoonup$1,
  rightleftarrows: rightleftarrows$1,
  rightleftharpoons: rightleftharpoons$1,
  rightrightarrows: rightrightarrows$1,
  rightsquigarrow: rightsquigarrow$1,
  RightTeeArrow: RightTeeArrow$1,
  RightTee: RightTee$1,
  RightTeeVector: RightTeeVector$1,
  rightthreetimes: rightthreetimes$1,
  RightTriangleBar: RightTriangleBar$1,
  RightTriangle: RightTriangle$1,
  RightTriangleEqual: RightTriangleEqual$1,
  RightUpDownVector: RightUpDownVector$1,
  RightUpTeeVector: RightUpTeeVector$1,
  RightUpVectorBar: RightUpVectorBar$1,
  RightUpVector: RightUpVector$1,
  RightVectorBar: RightVectorBar$1,
  RightVector: RightVector$1,
  ring: ring$1,
  risingdotseq: risingdotseq$1,
  rlarr: rlarr$1,
  rlhar: rlhar$1,
  rlm: rlm$1,
  rmoustache: rmoustache$1,
  rmoust: rmoust$1,
  rnmid: rnmid$1,
  roang: roang$1,
  roarr: roarr$1,
  robrk: robrk$1,
  ropar: ropar$1,
  ropf: ropf$1,
  Ropf: Ropf$1,
  roplus: roplus$1,
  rotimes: rotimes$1,
  RoundImplies: RoundImplies$1,
  rpar: rpar$1,
  rpargt: rpargt$1,
  rppolint: rppolint$1,
  rrarr: rrarr$1,
  Rrightarrow: Rrightarrow$1,
  rsaquo: rsaquo$1,
  rscr: rscr$1,
  Rscr: Rscr$1,
  rsh: rsh$1,
  Rsh: Rsh$1,
  rsqb: rsqb$1,
  rsquo: rsquo$1,
  rsquor: rsquor$1,
  rthree: rthree$1,
  rtimes: rtimes$1,
  rtri: rtri$1,
  rtrie: rtrie$1,
  rtrif: rtrif$1,
  rtriltri: rtriltri$1,
  RuleDelayed: RuleDelayed$1,
  ruluhar: ruluhar$1,
  rx: rx$1,
  Sacute: Sacute$1,
  sacute: sacute$1,
  sbquo: sbquo$1,
  scap: scap$1,
  Scaron: Scaron$1,
  scaron: scaron$1,
  Sc: Sc$1,
  sc: sc$1,
  sccue: sccue$1,
  sce: sce$1,
  scE: scE$1,
  Scedil: Scedil$1,
  scedil: scedil$1,
  Scirc: Scirc$1,
  scirc: scirc$1,
  scnap: scnap$1,
  scnE: scnE$1,
  scnsim: scnsim$1,
  scpolint: scpolint$1,
  scsim: scsim$1,
  Scy: Scy$1,
  scy: scy$1,
  sdotb: sdotb$1,
  sdot: sdot$1,
  sdote: sdote$1,
  searhk: searhk$1,
  searr: searr$1,
  seArr: seArr$1,
  searrow: searrow$1,
  sect: sect$3,
  semi: semi$1,
  seswar: seswar$1,
  setminus: setminus$1,
  setmn: setmn$1,
  sext: sext$1,
  Sfr: Sfr$1,
  sfr: sfr$1,
  sfrown: sfrown$1,
  sharp: sharp$1,
  SHCHcy: SHCHcy$1,
  shchcy: shchcy$1,
  SHcy: SHcy$1,
  shcy: shcy$1,
  ShortDownArrow: ShortDownArrow$1,
  ShortLeftArrow: ShortLeftArrow$1,
  shortmid: shortmid$1,
  shortparallel: shortparallel$1,
  ShortRightArrow: ShortRightArrow$1,
  ShortUpArrow: ShortUpArrow$1,
  shy: shy$3,
  Sigma: Sigma$1,
  sigma: sigma$1,
  sigmaf: sigmaf$1,
  sigmav: sigmav$1,
  sim: sim$1,
  simdot: simdot$1,
  sime: sime$1,
  simeq: simeq$1,
  simg: simg$1,
  simgE: simgE$1,
  siml: siml$1,
  simlE: simlE$1,
  simne: simne$1,
  simplus: simplus$1,
  simrarr: simrarr$1,
  slarr: slarr$1,
  SmallCircle: SmallCircle$1,
  smallsetminus: smallsetminus$1,
  smashp: smashp$1,
  smeparsl: smeparsl$1,
  smid: smid$1,
  smile: smile$1,
  smt: smt$1,
  smte: smte$1,
  smtes: smtes$1,
  SOFTcy: SOFTcy$1,
  softcy: softcy$1,
  solbar: solbar$1,
  solb: solb$1,
  sol: sol$1,
  Sopf: Sopf$1,
  sopf: sopf$1,
  spades: spades$1,
  spadesuit: spadesuit$1,
  spar: spar$1,
  sqcap: sqcap$1,
  sqcaps: sqcaps$1,
  sqcup: sqcup$1,
  sqcups: sqcups$1,
  Sqrt: Sqrt$1,
  sqsub: sqsub$1,
  sqsube: sqsube$1,
  sqsubset: sqsubset$1,
  sqsubseteq: sqsubseteq$1,
  sqsup: sqsup$1,
  sqsupe: sqsupe$1,
  sqsupset: sqsupset$1,
  sqsupseteq: sqsupseteq$1,
  square: square$1,
  Square: Square$1,
  SquareIntersection: SquareIntersection$1,
  SquareSubset: SquareSubset$1,
  SquareSubsetEqual: SquareSubsetEqual$1,
  SquareSuperset: SquareSuperset$1,
  SquareSupersetEqual: SquareSupersetEqual$1,
  SquareUnion: SquareUnion$1,
  squarf: squarf$1,
  squ: squ$1,
  squf: squf$1,
  srarr: srarr$1,
  Sscr: Sscr$1,
  sscr: sscr$1,
  ssetmn: ssetmn$1,
  ssmile: ssmile$1,
  sstarf: sstarf$1,
  Star: Star$1,
  star: star$1,
  starf: starf$1,
  straightepsilon: straightepsilon$1,
  straightphi: straightphi$1,
  strns: strns$1,
  sub: sub$1,
  Sub: Sub$1,
  subdot: subdot$1,
  subE: subE$1,
  sube: sube$1,
  subedot: subedot$1,
  submult: submult$1,
  subnE: subnE$1,
  subne: subne$1,
  subplus: subplus$1,
  subrarr: subrarr$1,
  subset: subset$1,
  Subset: Subset$1,
  subseteq: subseteq$1,
  subseteqq: subseteqq$1,
  SubsetEqual: SubsetEqual$1,
  subsetneq: subsetneq$1,
  subsetneqq: subsetneqq$1,
  subsim: subsim$1,
  subsub: subsub$1,
  subsup: subsup$1,
  succapprox: succapprox$1,
  succ: succ$1,
  succcurlyeq: succcurlyeq$1,
  Succeeds: Succeeds$1,
  SucceedsEqual: SucceedsEqual$1,
  SucceedsSlantEqual: SucceedsSlantEqual$1,
  SucceedsTilde: SucceedsTilde$1,
  succeq: succeq$1,
  succnapprox: succnapprox$1,
  succneqq: succneqq$1,
  succnsim: succnsim$1,
  succsim: succsim$1,
  SuchThat: SuchThat$1,
  sum: sum$1,
  Sum: Sum$1,
  sung: sung$1,
  sup1: sup1$3,
  sup2: sup2$3,
  sup3: sup3$3,
  sup: sup$1,
  Sup: Sup$1,
  supdot: supdot$1,
  supdsub: supdsub$1,
  supE: supE$1,
  supe: supe$1,
  supedot: supedot$1,
  Superset: Superset$1,
  SupersetEqual: SupersetEqual$1,
  suphsol: suphsol$1,
  suphsub: suphsub$1,
  suplarr: suplarr$1,
  supmult: supmult$1,
  supnE: supnE$1,
  supne: supne$1,
  supplus: supplus$1,
  supset: supset$1,
  Supset: Supset$1,
  supseteq: supseteq$1,
  supseteqq: supseteqq$1,
  supsetneq: supsetneq$1,
  supsetneqq: supsetneqq$1,
  supsim: supsim$1,
  supsub: supsub$1,
  supsup: supsup$1,
  swarhk: swarhk$1,
  swarr: swarr$1,
  swArr: swArr$1,
  swarrow: swarrow$1,
  swnwar: swnwar$1,
  szlig: szlig$3,
  Tab: Tab$1,
  target: target$1,
  Tau: Tau$1,
  tau: tau$1,
  tbrk: tbrk$1,
  Tcaron: Tcaron$1,
  tcaron: tcaron$1,
  Tcedil: Tcedil$1,
  tcedil: tcedil$1,
  Tcy: Tcy$1,
  tcy: tcy$1,
  tdot: tdot$1,
  telrec: telrec$1,
  Tfr: Tfr$1,
  tfr: tfr$1,
  there4: there4$1,
  therefore: therefore$1,
  Therefore: Therefore$1,
  Theta: Theta$1,
  theta: theta$1,
  thetasym: thetasym$1,
  thetav: thetav$1,
  thickapprox: thickapprox$1,
  thicksim: thicksim$1,
  ThickSpace: ThickSpace$1,
  ThinSpace: ThinSpace$1,
  thinsp: thinsp$1,
  thkap: thkap$1,
  thksim: thksim$1,
  THORN: THORN$3,
  thorn: thorn$3,
  tilde: tilde$1,
  Tilde: Tilde$1,
  TildeEqual: TildeEqual$1,
  TildeFullEqual: TildeFullEqual$1,
  TildeTilde: TildeTilde$1,
  timesbar: timesbar$1,
  timesb: timesb$1,
  times: times$3,
  timesd: timesd$1,
  tint: tint$1,
  toea: toea$1,
  topbot: topbot$1,
  topcir: topcir$1,
  top: top$1,
  Topf: Topf$1,
  topf: topf$1,
  topfork: topfork$1,
  tosa: tosa$1,
  tprime: tprime$1,
  trade: trade$1,
  TRADE: TRADE$1,
  triangle: triangle$1,
  triangledown: triangledown$1,
  triangleleft: triangleleft$1,
  trianglelefteq: trianglelefteq$1,
  triangleq: triangleq$1,
  triangleright: triangleright$1,
  trianglerighteq: trianglerighteq$1,
  tridot: tridot$1,
  trie: trie$1,
  triminus: triminus$1,
  TripleDot: TripleDot$1,
  triplus: triplus$1,
  trisb: trisb$1,
  tritime: tritime$1,
  trpezium: trpezium$1,
  Tscr: Tscr$1,
  tscr: tscr$1,
  TScy: TScy$1,
  tscy: tscy$1,
  TSHcy: TSHcy$1,
  tshcy: tshcy$1,
  Tstrok: Tstrok$1,
  tstrok: tstrok$1,
  twixt: twixt$1,
  twoheadleftarrow: twoheadleftarrow$1,
  twoheadrightarrow: twoheadrightarrow$1,
  Uacute: Uacute$3,
  uacute: uacute$3,
  uarr: uarr$1,
  Uarr: Uarr$1,
  uArr: uArr$1,
  Uarrocir: Uarrocir$1,
  Ubrcy: Ubrcy$1,
  ubrcy: ubrcy$1,
  Ubreve: Ubreve$1,
  ubreve: ubreve$1,
  Ucirc: Ucirc$3,
  ucirc: ucirc$3,
  Ucy: Ucy$1,
  ucy: ucy$1,
  udarr: udarr$1,
  Udblac: Udblac$1,
  udblac: udblac$1,
  udhar: udhar$1,
  ufisht: ufisht$1,
  Ufr: Ufr$1,
  ufr: ufr$1,
  Ugrave: Ugrave$3,
  ugrave: ugrave$3,
  uHar: uHar$1,
  uharl: uharl$1,
  uharr: uharr$1,
  uhblk: uhblk$1,
  ulcorn: ulcorn$1,
  ulcorner: ulcorner$1,
  ulcrop: ulcrop$1,
  ultri: ultri$1,
  Umacr: Umacr$1,
  umacr: umacr$1,
  uml: uml$3,
  UnderBar: UnderBar$1,
  UnderBrace: UnderBrace$1,
  UnderBracket: UnderBracket$1,
  UnderParenthesis: UnderParenthesis$1,
  Union: Union$1,
  UnionPlus: UnionPlus$1,
  Uogon: Uogon$1,
  uogon: uogon$1,
  Uopf: Uopf$1,
  uopf: uopf$1,
  UpArrowBar: UpArrowBar$1,
  uparrow: uparrow$1,
  UpArrow: UpArrow$1,
  Uparrow: Uparrow$1,
  UpArrowDownArrow: UpArrowDownArrow$1,
  updownarrow: updownarrow$1,
  UpDownArrow: UpDownArrow$1,
  Updownarrow: Updownarrow$1,
  UpEquilibrium: UpEquilibrium$1,
  upharpoonleft: upharpoonleft$1,
  upharpoonright: upharpoonright$1,
  uplus: uplus$1,
  UpperLeftArrow: UpperLeftArrow$1,
  UpperRightArrow: UpperRightArrow$1,
  upsi: upsi$1,
  Upsi: Upsi$1,
  upsih: upsih$1,
  Upsilon: Upsilon$1,
  upsilon: upsilon$1,
  UpTeeArrow: UpTeeArrow$1,
  UpTee: UpTee$1,
  upuparrows: upuparrows$1,
  urcorn: urcorn$1,
  urcorner: urcorner$1,
  urcrop: urcrop$1,
  Uring: Uring$1,
  uring: uring$1,
  urtri: urtri$1,
  Uscr: Uscr$1,
  uscr: uscr$1,
  utdot: utdot$1,
  Utilde: Utilde$1,
  utilde: utilde$1,
  utri: utri$1,
  utrif: utrif$1,
  uuarr: uuarr$1,
  Uuml: Uuml$3,
  uuml: uuml$3,
  uwangle: uwangle$1,
  vangrt: vangrt$1,
  varepsilon: varepsilon$1,
  varkappa: varkappa$1,
  varnothing: varnothing$1,
  varphi: varphi$1,
  varpi: varpi$1,
  varpropto: varpropto$1,
  varr: varr$1,
  vArr: vArr$1,
  varrho: varrho$1,
  varsigma: varsigma$1,
  varsubsetneq: varsubsetneq$1,
  varsubsetneqq: varsubsetneqq$1,
  varsupsetneq: varsupsetneq$1,
  varsupsetneqq: varsupsetneqq$1,
  vartheta: vartheta$1,
  vartriangleleft: vartriangleleft$1,
  vartriangleright: vartriangleright$1,
  vBar: vBar$1,
  Vbar: Vbar$1,
  vBarv: vBarv$1,
  Vcy: Vcy$1,
  vcy: vcy$1,
  vdash: vdash$1,
  vDash: vDash$1,
  Vdash: Vdash$1,
  VDash: VDash$1,
  Vdashl: Vdashl$1,
  veebar: veebar$1,
  vee: vee$1,
  Vee: Vee$1,
  veeeq: veeeq$1,
  vellip: vellip$1,
  verbar: verbar$1,
  Verbar: Verbar$1,
  vert: vert$1,
  Vert: Vert$1,
  VerticalBar: VerticalBar$1,
  VerticalLine: VerticalLine$1,
  VerticalSeparator: VerticalSeparator$1,
  VerticalTilde: VerticalTilde$1,
  VeryThinSpace: VeryThinSpace$1,
  Vfr: Vfr$1,
  vfr: vfr$1,
  vltri: vltri$1,
  vnsub: vnsub$1,
  vnsup: vnsup$1,
  Vopf: Vopf$1,
  vopf: vopf$1,
  vprop: vprop$1,
  vrtri: vrtri$1,
  Vscr: Vscr$1,
  vscr: vscr$1,
  vsubnE: vsubnE$1,
  vsubne: vsubne$1,
  vsupnE: vsupnE$1,
  vsupne: vsupne$1,
  Vvdash: Vvdash$1,
  vzigzag: vzigzag$1,
  Wcirc: Wcirc$1,
  wcirc: wcirc$1,
  wedbar: wedbar$1,
  wedge: wedge$1,
  Wedge: Wedge$1,
  wedgeq: wedgeq$1,
  weierp: weierp$1,
  Wfr: Wfr$1,
  wfr: wfr$1,
  Wopf: Wopf$1,
  wopf: wopf$1,
  wp: wp$1,
  wr: wr$1,
  wreath: wreath$1,
  Wscr: Wscr$1,
  wscr: wscr$1,
  xcap: xcap$1,
  xcirc: xcirc$1,
  xcup: xcup$1,
  xdtri: xdtri$1,
  Xfr: Xfr$1,
  xfr: xfr$1,
  xharr: xharr$1,
  xhArr: xhArr$1,
  Xi: Xi$1,
  xi: xi$1,
  xlarr: xlarr$1,
  xlArr: xlArr$1,
  xmap: xmap$1,
  xnis: xnis$1,
  xodot: xodot$1,
  Xopf: Xopf$1,
  xopf: xopf$1,
  xoplus: xoplus$1,
  xotime: xotime$1,
  xrarr: xrarr$1,
  xrArr: xrArr$1,
  Xscr: Xscr$1,
  xscr: xscr$1,
  xsqcup: xsqcup$1,
  xuplus: xuplus$1,
  xutri: xutri$1,
  xvee: xvee$1,
  xwedge: xwedge$1,
  Yacute: Yacute$3,
  yacute: yacute$3,
  YAcy: YAcy$1,
  yacy: yacy$1,
  Ycirc: Ycirc$1,
  ycirc: ycirc$1,
  Ycy: Ycy$1,
  ycy: ycy$1,
  yen: yen$3,
  Yfr: Yfr$1,
  yfr: yfr$1,
  YIcy: YIcy$1,
  yicy: yicy$1,
  Yopf: Yopf$1,
  yopf: yopf$1,
  Yscr: Yscr$1,
  yscr: yscr$1,
  YUcy: YUcy$1,
  yucy: yucy$1,
  yuml: yuml$3,
  Yuml: Yuml$1,
  Zacute: Zacute$1,
  zacute: zacute$1,
  Zcaron: Zcaron$1,
  zcaron: zcaron$1,
  Zcy: Zcy$1,
  zcy: zcy$1,
  Zdot: Zdot$1,
  zdot: zdot$1,
  zeetrf: zeetrf$1,
  ZeroWidthSpace: ZeroWidthSpace$1,
  Zeta: Zeta$1,
  zeta: zeta$1,
  zfr: zfr$1,
  Zfr: Zfr$1,
  ZHcy: ZHcy$1,
  zhcy: zhcy$1,
  zigrarr: zigrarr$1,
  zopf: zopf$1,
  Zopf: Zopf$1,
  Zscr: Zscr$1,
  zscr: zscr$1,
  zwj: zwj$1,
  zwnj: zwnj$1
};
const Aacute$2 = "\xC1";
const aacute$2 = "\xE1";
const Acirc$2 = "\xC2";
const acirc$2 = "\xE2";
const acute$2 = "\xB4";
const AElig$2 = "\xC6";
const aelig$2 = "\xE6";
const Agrave$2 = "\xC0";
const agrave$2 = "\xE0";
const amp$4 = "&";
const AMP$2 = "&";
const Aring$2 = "\xC5";
const aring$2 = "\xE5";
const Atilde$2 = "\xC3";
const atilde$2 = "\xE3";
const Auml$2 = "\xC4";
const auml$2 = "\xE4";
const brvbar$2 = "\xA6";
const Ccedil$2 = "\xC7";
const ccedil$2 = "\xE7";
const cedil$2 = "\xB8";
const cent$2 = "\xA2";
const copy$2 = "\xA9";
const COPY$2 = "\xA9";
const curren$2 = "\xA4";
const deg$2 = "\xB0";
const divide$2 = "\xF7";
const Eacute$2 = "\xC9";
const eacute$2 = "\xE9";
const Ecirc$2 = "\xCA";
const ecirc$2 = "\xEA";
const Egrave$2 = "\xC8";
const egrave$2 = "\xE8";
const ETH$2 = "\xD0";
const eth$2 = "\xF0";
const Euml$2 = "\xCB";
const euml$2 = "\xEB";
const frac12$2 = "\xBD";
const frac14$2 = "\xBC";
const frac34$2 = "\xBE";
const gt$4 = ">";
const GT$2 = ">";
const Iacute$2 = "\xCD";
const iacute$2 = "\xED";
const Icirc$2 = "\xCE";
const icirc$2 = "\xEE";
const iexcl$2 = "\xA1";
const Igrave$2 = "\xCC";
const igrave$2 = "\xEC";
const iquest$2 = "\xBF";
const Iuml$2 = "\xCF";
const iuml$2 = "\xEF";
const laquo$2 = "\xAB";
const lt$4 = "<";
const LT$2 = "<";
const macr$2 = "\xAF";
const micro$2 = "\xB5";
const middot$2 = "\xB7";
const nbsp$2 = "\xA0";
const not$2 = "\xAC";
const Ntilde$2 = "\xD1";
const ntilde$2 = "\xF1";
const Oacute$2 = "\xD3";
const oacute$2 = "\xF3";
const Ocirc$2 = "\xD4";
const ocirc$2 = "\xF4";
const Ograve$2 = "\xD2";
const ograve$2 = "\xF2";
const ordf$2 = "\xAA";
const ordm$2 = "\xBA";
const Oslash$2 = "\xD8";
const oslash$2 = "\xF8";
const Otilde$2 = "\xD5";
const otilde$2 = "\xF5";
const Ouml$2 = "\xD6";
const ouml$2 = "\xF6";
const para$2 = "\xB6";
const plusmn$2 = "\xB1";
const pound$2 = "\xA3";
const quot$4 = '"';
const QUOT$2 = '"';
const raquo$2 = "\xBB";
const reg$2 = "\xAE";
const REG$2 = "\xAE";
const sect$2 = "\xA7";
const shy$2 = "\xAD";
const sup1$2 = "\xB9";
const sup2$2 = "\xB2";
const sup3$2 = "\xB3";
const szlig$2 = "\xDF";
const THORN$2 = "\xDE";
const thorn$2 = "\xFE";
const times$2 = "\xD7";
const Uacute$2 = "\xDA";
const uacute$2 = "\xFA";
const Ucirc$2 = "\xDB";
const ucirc$2 = "\xFB";
const Ugrave$2 = "\xD9";
const ugrave$2 = "\xF9";
const uml$2 = "\xA8";
const Uuml$2 = "\xDC";
const uuml$2 = "\xFC";
const Yacute$2 = "\xDD";
const yacute$2 = "\xFD";
const yen$2 = "\xA5";
const yuml$2 = "\xFF";
const require$$2$1 = {
  Aacute: Aacute$2,
  aacute: aacute$2,
  Acirc: Acirc$2,
  acirc: acirc$2,
  acute: acute$2,
  AElig: AElig$2,
  aelig: aelig$2,
  Agrave: Agrave$2,
  agrave: agrave$2,
  amp: amp$4,
  AMP: AMP$2,
  Aring: Aring$2,
  aring: aring$2,
  Atilde: Atilde$2,
  atilde: atilde$2,
  Auml: Auml$2,
  auml: auml$2,
  brvbar: brvbar$2,
  Ccedil: Ccedil$2,
  ccedil: ccedil$2,
  cedil: cedil$2,
  cent: cent$2,
  copy: copy$2,
  COPY: COPY$2,
  curren: curren$2,
  deg: deg$2,
  divide: divide$2,
  Eacute: Eacute$2,
  eacute: eacute$2,
  Ecirc: Ecirc$2,
  ecirc: ecirc$2,
  Egrave: Egrave$2,
  egrave: egrave$2,
  ETH: ETH$2,
  eth: eth$2,
  Euml: Euml$2,
  euml: euml$2,
  frac12: frac12$2,
  frac14: frac14$2,
  frac34: frac34$2,
  gt: gt$4,
  GT: GT$2,
  Iacute: Iacute$2,
  iacute: iacute$2,
  Icirc: Icirc$2,
  icirc: icirc$2,
  iexcl: iexcl$2,
  Igrave: Igrave$2,
  igrave: igrave$2,
  iquest: iquest$2,
  Iuml: Iuml$2,
  iuml: iuml$2,
  laquo: laquo$2,
  lt: lt$4,
  LT: LT$2,
  macr: macr$2,
  micro: micro$2,
  middot: middot$2,
  nbsp: nbsp$2,
  not: not$2,
  Ntilde: Ntilde$2,
  ntilde: ntilde$2,
  Oacute: Oacute$2,
  oacute: oacute$2,
  Ocirc: Ocirc$2,
  ocirc: ocirc$2,
  Ograve: Ograve$2,
  ograve: ograve$2,
  ordf: ordf$2,
  ordm: ordm$2,
  Oslash: Oslash$2,
  oslash: oslash$2,
  Otilde: Otilde$2,
  otilde: otilde$2,
  Ouml: Ouml$2,
  ouml: ouml$2,
  para: para$2,
  plusmn: plusmn$2,
  pound: pound$2,
  quot: quot$4,
  QUOT: QUOT$2,
  raquo: raquo$2,
  reg: reg$2,
  REG: REG$2,
  sect: sect$2,
  shy: shy$2,
  sup1: sup1$2,
  sup2: sup2$2,
  sup3: sup3$2,
  szlig: szlig$2,
  THORN: THORN$2,
  thorn: thorn$2,
  times: times$2,
  Uacute: Uacute$2,
  uacute: uacute$2,
  Ucirc: Ucirc$2,
  ucirc: ucirc$2,
  Ugrave: Ugrave$2,
  ugrave: ugrave$2,
  uml: uml$2,
  Uuml: Uuml$2,
  uuml: uuml$2,
  Yacute: Yacute$2,
  yacute: yacute$2,
  yen: yen$2,
  yuml: yuml$2
};
const amp$3 = "&";
const apos$2 = "'";
const gt$3 = ">";
const lt$3 = "<";
const quot$3 = '"';
const require$$3 = {
  amp: amp$3,
  apos: apos$2,
  gt: gt$3,
  lt: lt$3,
  quot: quot$3
};
var Tokenizer_1 = Tokenizer$1;
var decodeCodePoint = decode_codepoint$1;
var entityMap = require$$1$2;
var legacyMap = require$$2$1;
var xmlMap = require$$3;
var i = 0;
var TEXT = i++;
var BEFORE_TAG_NAME = i++;
var IN_TAG_NAME = i++;
var IN_SELF_CLOSING_TAG = i++;
var BEFORE_CLOSING_TAG_NAME = i++;
var IN_CLOSING_TAG_NAME = i++;
var AFTER_CLOSING_TAG_NAME = i++;
var BEFORE_ATTRIBUTE_NAME = i++;
var IN_ATTRIBUTE_NAME = i++;
var AFTER_ATTRIBUTE_NAME = i++;
var BEFORE_ATTRIBUTE_VALUE = i++;
var IN_ATTRIBUTE_VALUE_DQ = i++;
var IN_ATTRIBUTE_VALUE_SQ = i++;
var IN_ATTRIBUTE_VALUE_NQ = i++;
var BEFORE_DECLARATION = i++;
var IN_DECLARATION = i++;
var IN_PROCESSING_INSTRUCTION = i++;
var BEFORE_COMMENT = i++;
var IN_COMMENT = i++;
var AFTER_COMMENT_1 = i++;
var AFTER_COMMENT_2 = i++;
var BEFORE_CDATA_1 = i++;
var BEFORE_CDATA_2 = i++;
var BEFORE_CDATA_3 = i++;
var BEFORE_CDATA_4 = i++;
var BEFORE_CDATA_5 = i++;
var BEFORE_CDATA_6 = i++;
var IN_CDATA = i++;
var AFTER_CDATA_1 = i++;
var AFTER_CDATA_2 = i++;
var BEFORE_SPECIAL = i++;
var BEFORE_SPECIAL_END = i++;
var BEFORE_SCRIPT_1 = i++;
var BEFORE_SCRIPT_2 = i++;
var BEFORE_SCRIPT_3 = i++;
var BEFORE_SCRIPT_4 = i++;
var BEFORE_SCRIPT_5 = i++;
var AFTER_SCRIPT_1 = i++;
var AFTER_SCRIPT_2 = i++;
var AFTER_SCRIPT_3 = i++;
var AFTER_SCRIPT_4 = i++;
var AFTER_SCRIPT_5 = i++;
var BEFORE_STYLE_1 = i++;
var BEFORE_STYLE_2 = i++;
var BEFORE_STYLE_3 = i++;
var BEFORE_STYLE_4 = i++;
var AFTER_STYLE_1 = i++;
var AFTER_STYLE_2 = i++;
var AFTER_STYLE_3 = i++;
var AFTER_STYLE_4 = i++;
var BEFORE_ENTITY = i++;
var BEFORE_NUMERIC_ENTITY = i++;
var IN_NAMED_ENTITY = i++;
var IN_NUMERIC_ENTITY = i++;
var IN_HEX_ENTITY = i++;
var j = 0;
var SPECIAL_NONE = j++;
var SPECIAL_SCRIPT = j++;
var SPECIAL_STYLE = j++;
function whitespace(c) {
  return c === " " || c === "\n" || c === "	" || c === "\f" || c === "\r";
}
function ifElseState(upper, SUCCESS, FAILURE) {
  var lower = upper.toLowerCase();
  if (upper === lower) {
    return function(c) {
      if (c === lower) {
        this._state = SUCCESS;
      } else {
        this._state = FAILURE;
        this._index--;
      }
    };
  } else {
    return function(c) {
      if (c === lower || c === upper) {
        this._state = SUCCESS;
      } else {
        this._state = FAILURE;
        this._index--;
      }
    };
  }
}
function consumeSpecialNameChar(upper, NEXT_STATE) {
  var lower = upper.toLowerCase();
  return function(c) {
    if (c === lower || c === upper) {
      this._state = NEXT_STATE;
    } else {
      this._state = IN_TAG_NAME;
      this._index--;
    }
  };
}
function Tokenizer$1(options, cbs) {
  this._state = TEXT;
  this._buffer = "";
  this._sectionStart = 0;
  this._index = 0;
  this._bufferOffset = 0;
  this._baseState = TEXT;
  this._special = SPECIAL_NONE;
  this._cbs = cbs;
  this._running = true;
  this._ended = false;
  this._xmlMode = !!(options && options.xmlMode);
  this._decodeEntities = !!(options && options.decodeEntities);
}
Tokenizer$1.prototype._stateText = function(c) {
  if (c === "<") {
    if (this._index > this._sectionStart) {
      this._cbs.ontext(this._getSection());
    }
    this._state = BEFORE_TAG_NAME;
    this._sectionStart = this._index;
  } else if (this._decodeEntities && this._special === SPECIAL_NONE && c === "&") {
    if (this._index > this._sectionStart) {
      this._cbs.ontext(this._getSection());
    }
    this._baseState = TEXT;
    this._state = BEFORE_ENTITY;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateBeforeTagName = function(c) {
  if (c === "/") {
    this._state = BEFORE_CLOSING_TAG_NAME;
  } else if (c === "<") {
    this._cbs.ontext(this._getSection());
    this._sectionStart = this._index;
  } else if (c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
    this._state = TEXT;
  } else if (c === "!") {
    this._state = BEFORE_DECLARATION;
    this._sectionStart = this._index + 1;
  } else if (c === "?") {
    this._state = IN_PROCESSING_INSTRUCTION;
    this._sectionStart = this._index + 1;
  } else {
    this._state = !this._xmlMode && (c === "s" || c === "S") ? BEFORE_SPECIAL : IN_TAG_NAME;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateInTagName = function(c) {
  if (c === "/" || c === ">" || whitespace(c)) {
    this._emitToken("onopentagname");
    this._state = BEFORE_ATTRIBUTE_NAME;
    this._index--;
  }
};
Tokenizer$1.prototype._stateBeforeCloseingTagName = function(c) {
  if (whitespace(c))
    ;
  else if (c === ">") {
    this._state = TEXT;
  } else if (this._special !== SPECIAL_NONE) {
    if (c === "s" || c === "S") {
      this._state = BEFORE_SPECIAL_END;
    } else {
      this._state = TEXT;
      this._index--;
    }
  } else {
    this._state = IN_CLOSING_TAG_NAME;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateInCloseingTagName = function(c) {
  if (c === ">" || whitespace(c)) {
    this._emitToken("onclosetag");
    this._state = AFTER_CLOSING_TAG_NAME;
    this._index--;
  }
};
Tokenizer$1.prototype._stateAfterCloseingTagName = function(c) {
  if (c === ">") {
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  }
};
Tokenizer$1.prototype._stateBeforeAttributeName = function(c) {
  if (c === ">") {
    this._cbs.onopentagend();
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  } else if (c === "/") {
    this._state = IN_SELF_CLOSING_TAG;
  } else if (!whitespace(c)) {
    this._state = IN_ATTRIBUTE_NAME;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateInSelfClosingTag = function(c) {
  if (c === ">") {
    this._cbs.onselfclosingtag();
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  } else if (!whitespace(c)) {
    this._state = BEFORE_ATTRIBUTE_NAME;
    this._index--;
  }
};
Tokenizer$1.prototype._stateInAttributeName = function(c) {
  if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
    this._cbs.onattribname(this._getSection());
    this._sectionStart = -1;
    this._state = AFTER_ATTRIBUTE_NAME;
    this._index--;
  }
};
Tokenizer$1.prototype._stateAfterAttributeName = function(c) {
  if (c === "=") {
    this._state = BEFORE_ATTRIBUTE_VALUE;
  } else if (c === "/" || c === ">") {
    this._cbs.onattribend();
    this._state = BEFORE_ATTRIBUTE_NAME;
    this._index--;
  } else if (!whitespace(c)) {
    this._cbs.onattribend();
    this._state = IN_ATTRIBUTE_NAME;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateBeforeAttributeValue = function(c) {
  if (c === '"') {
    this._state = IN_ATTRIBUTE_VALUE_DQ;
    this._sectionStart = this._index + 1;
  } else if (c === "'") {
    this._state = IN_ATTRIBUTE_VALUE_SQ;
    this._sectionStart = this._index + 1;
  } else if (!whitespace(c)) {
    this._state = IN_ATTRIBUTE_VALUE_NQ;
    this._sectionStart = this._index;
    this._index--;
  }
};
Tokenizer$1.prototype._stateInAttributeValueDoubleQuotes = function(c) {
  if (c === '"') {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = BEFORE_ATTRIBUTE_NAME;
  } else if (this._decodeEntities && c === "&") {
    this._emitToken("onattribdata");
    this._baseState = this._state;
    this._state = BEFORE_ENTITY;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateInAttributeValueSingleQuotes = function(c) {
  if (c === "'") {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = BEFORE_ATTRIBUTE_NAME;
  } else if (this._decodeEntities && c === "&") {
    this._emitToken("onattribdata");
    this._baseState = this._state;
    this._state = BEFORE_ENTITY;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateInAttributeValueNoQuotes = function(c) {
  if (whitespace(c) || c === ">") {
    this._emitToken("onattribdata");
    this._cbs.onattribend();
    this._state = BEFORE_ATTRIBUTE_NAME;
    this._index--;
  } else if (this._decodeEntities && c === "&") {
    this._emitToken("onattribdata");
    this._baseState = this._state;
    this._state = BEFORE_ENTITY;
    this._sectionStart = this._index;
  }
};
Tokenizer$1.prototype._stateBeforeDeclaration = function(c) {
  this._state = c === "[" ? BEFORE_CDATA_1 : c === "-" ? BEFORE_COMMENT : IN_DECLARATION;
};
Tokenizer$1.prototype._stateInDeclaration = function(c) {
  if (c === ">") {
    this._cbs.ondeclaration(this._getSection());
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  }
};
Tokenizer$1.prototype._stateInProcessingInstruction = function(c) {
  if (c === ">") {
    this._cbs.onprocessinginstruction(this._getSection());
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  }
};
Tokenizer$1.prototype._stateBeforeComment = function(c) {
  if (c === "-") {
    this._state = IN_COMMENT;
    this._sectionStart = this._index + 1;
  } else {
    this._state = IN_DECLARATION;
  }
};
Tokenizer$1.prototype._stateInComment = function(c) {
  if (c === "-")
    this._state = AFTER_COMMENT_1;
};
Tokenizer$1.prototype._stateAfterComment1 = function(c) {
  if (c === "-") {
    this._state = AFTER_COMMENT_2;
  } else {
    this._state = IN_COMMENT;
  }
};
Tokenizer$1.prototype._stateAfterComment2 = function(c) {
  if (c === ">") {
    this._cbs.oncomment(
      this._buffer.substring(this._sectionStart, this._index - 2)
    );
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  } else if (c !== "-") {
    this._state = IN_COMMENT;
  }
};
Tokenizer$1.prototype._stateBeforeCdata1 = ifElseState(
  "C",
  BEFORE_CDATA_2,
  IN_DECLARATION
);
Tokenizer$1.prototype._stateBeforeCdata2 = ifElseState(
  "D",
  BEFORE_CDATA_3,
  IN_DECLARATION
);
Tokenizer$1.prototype._stateBeforeCdata3 = ifElseState(
  "A",
  BEFORE_CDATA_4,
  IN_DECLARATION
);
Tokenizer$1.prototype._stateBeforeCdata4 = ifElseState(
  "T",
  BEFORE_CDATA_5,
  IN_DECLARATION
);
Tokenizer$1.prototype._stateBeforeCdata5 = ifElseState(
  "A",
  BEFORE_CDATA_6,
  IN_DECLARATION
);
Tokenizer$1.prototype._stateBeforeCdata6 = function(c) {
  if (c === "[") {
    this._state = IN_CDATA;
    this._sectionStart = this._index + 1;
  } else {
    this._state = IN_DECLARATION;
    this._index--;
  }
};
Tokenizer$1.prototype._stateInCdata = function(c) {
  if (c === "]")
    this._state = AFTER_CDATA_1;
};
Tokenizer$1.prototype._stateAfterCdata1 = function(c) {
  if (c === "]")
    this._state = AFTER_CDATA_2;
  else
    this._state = IN_CDATA;
};
Tokenizer$1.prototype._stateAfterCdata2 = function(c) {
  if (c === ">") {
    this._cbs.oncdata(
      this._buffer.substring(this._sectionStart, this._index - 2)
    );
    this._state = TEXT;
    this._sectionStart = this._index + 1;
  } else if (c !== "]") {
    this._state = IN_CDATA;
  }
};
Tokenizer$1.prototype._stateBeforeSpecial = function(c) {
  if (c === "c" || c === "C") {
    this._state = BEFORE_SCRIPT_1;
  } else if (c === "t" || c === "T") {
    this._state = BEFORE_STYLE_1;
  } else {
    this._state = IN_TAG_NAME;
    this._index--;
  }
};
Tokenizer$1.prototype._stateBeforeSpecialEnd = function(c) {
  if (this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")) {
    this._state = AFTER_SCRIPT_1;
  } else if (this._special === SPECIAL_STYLE && (c === "t" || c === "T")) {
    this._state = AFTER_STYLE_1;
  } else
    this._state = TEXT;
};
Tokenizer$1.prototype._stateBeforeScript1 = consumeSpecialNameChar(
  "R",
  BEFORE_SCRIPT_2
);
Tokenizer$1.prototype._stateBeforeScript2 = consumeSpecialNameChar(
  "I",
  BEFORE_SCRIPT_3
);
Tokenizer$1.prototype._stateBeforeScript3 = consumeSpecialNameChar(
  "P",
  BEFORE_SCRIPT_4
);
Tokenizer$1.prototype._stateBeforeScript4 = consumeSpecialNameChar(
  "T",
  BEFORE_SCRIPT_5
);
Tokenizer$1.prototype._stateBeforeScript5 = function(c) {
  if (c === "/" || c === ">" || whitespace(c)) {
    this._special = SPECIAL_SCRIPT;
  }
  this._state = IN_TAG_NAME;
  this._index--;
};
Tokenizer$1.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
Tokenizer$1.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
Tokenizer$1.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
Tokenizer$1.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);
Tokenizer$1.prototype._stateAfterScript5 = function(c) {
  if (c === ">" || whitespace(c)) {
    this._special = SPECIAL_NONE;
    this._state = IN_CLOSING_TAG_NAME;
    this._sectionStart = this._index - 6;
    this._index--;
  } else
    this._state = TEXT;
};
Tokenizer$1.prototype._stateBeforeStyle1 = consumeSpecialNameChar(
  "Y",
  BEFORE_STYLE_2
);
Tokenizer$1.prototype._stateBeforeStyle2 = consumeSpecialNameChar(
  "L",
  BEFORE_STYLE_3
);
Tokenizer$1.prototype._stateBeforeStyle3 = consumeSpecialNameChar(
  "E",
  BEFORE_STYLE_4
);
Tokenizer$1.prototype._stateBeforeStyle4 = function(c) {
  if (c === "/" || c === ">" || whitespace(c)) {
    this._special = SPECIAL_STYLE;
  }
  this._state = IN_TAG_NAME;
  this._index--;
};
Tokenizer$1.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
Tokenizer$1.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
Tokenizer$1.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);
Tokenizer$1.prototype._stateAfterStyle4 = function(c) {
  if (c === ">" || whitespace(c)) {
    this._special = SPECIAL_NONE;
    this._state = IN_CLOSING_TAG_NAME;
    this._sectionStart = this._index - 5;
    this._index--;
  } else
    this._state = TEXT;
};
Tokenizer$1.prototype._stateBeforeEntity = ifElseState(
  "#",
  BEFORE_NUMERIC_ENTITY,
  IN_NAMED_ENTITY
);
Tokenizer$1.prototype._stateBeforeNumericEntity = ifElseState(
  "X",
  IN_HEX_ENTITY,
  IN_NUMERIC_ENTITY
);
Tokenizer$1.prototype._parseNamedEntityStrict = function() {
  if (this._sectionStart + 1 < this._index) {
    var entity = this._buffer.substring(
      this._sectionStart + 1,
      this._index
    ), map2 = this._xmlMode ? xmlMap : entityMap;
    if (map2.hasOwnProperty(entity)) {
      this._emitPartial(map2[entity]);
      this._sectionStart = this._index + 1;
    }
  }
};
Tokenizer$1.prototype._parseLegacyEntity = function() {
  var start = this._sectionStart + 1, limit = this._index - start;
  if (limit > 6)
    limit = 6;
  while (limit >= 2) {
    var entity = this._buffer.substr(start, limit);
    if (legacyMap.hasOwnProperty(entity)) {
      this._emitPartial(legacyMap[entity]);
      this._sectionStart += limit + 1;
      return;
    } else {
      limit--;
    }
  }
};
Tokenizer$1.prototype._stateInNamedEntity = function(c) {
  if (c === ";") {
    this._parseNamedEntityStrict();
    if (this._sectionStart + 1 < this._index && !this._xmlMode) {
      this._parseLegacyEntity();
    }
    this._state = this._baseState;
  } else if ((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")) {
    if (this._xmlMode)
      ;
    else if (this._sectionStart + 1 === this._index)
      ;
    else if (this._baseState !== TEXT) {
      if (c !== "=") {
        this._parseNamedEntityStrict();
      }
    } else {
      this._parseLegacyEntity();
    }
    this._state = this._baseState;
    this._index--;
  }
};
Tokenizer$1.prototype._decodeNumericEntity = function(offset, base) {
  var sectionStart = this._sectionStart + offset;
  if (sectionStart !== this._index) {
    var entity = this._buffer.substring(sectionStart, this._index);
    var parsed = parseInt(entity, base);
    this._emitPartial(decodeCodePoint(parsed));
    this._sectionStart = this._index;
  } else {
    this._sectionStart--;
  }
  this._state = this._baseState;
};
Tokenizer$1.prototype._stateInNumericEntity = function(c) {
  if (c === ";") {
    this._decodeNumericEntity(2, 10);
    this._sectionStart++;
  } else if (c < "0" || c > "9") {
    if (!this._xmlMode) {
      this._decodeNumericEntity(2, 10);
    } else {
      this._state = this._baseState;
    }
    this._index--;
  }
};
Tokenizer$1.prototype._stateInHexEntity = function(c) {
  if (c === ";") {
    this._decodeNumericEntity(3, 16);
    this._sectionStart++;
  } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
    if (!this._xmlMode) {
      this._decodeNumericEntity(3, 16);
    } else {
      this._state = this._baseState;
    }
    this._index--;
  }
};
Tokenizer$1.prototype._cleanup = function() {
  if (this._sectionStart < 0) {
    this._buffer = "";
    this._bufferOffset += this._index;
    this._index = 0;
  } else if (this._running) {
    if (this._state === TEXT) {
      if (this._sectionStart !== this._index) {
        this._cbs.ontext(this._buffer.substr(this._sectionStart));
      }
      this._buffer = "";
      this._bufferOffset += this._index;
      this._index = 0;
    } else if (this._sectionStart === this._index) {
      this._buffer = "";
      this._bufferOffset += this._index;
      this._index = 0;
    } else {
      this._buffer = this._buffer.substr(this._sectionStart);
      this._index -= this._sectionStart;
      this._bufferOffset += this._sectionStart;
    }
    this._sectionStart = 0;
  }
};
Tokenizer$1.prototype.write = function(chunk) {
  if (this._ended)
    this._cbs.onerror(Error(".write() after done!"));
  this._buffer += chunk;
  this._parse();
};
Tokenizer$1.prototype._parse = function() {
  while (this._index < this._buffer.length && this._running) {
    var c = this._buffer.charAt(this._index);
    if (this._state === TEXT) {
      this._stateText(c);
    } else if (this._state === BEFORE_TAG_NAME) {
      this._stateBeforeTagName(c);
    } else if (this._state === IN_TAG_NAME) {
      this._stateInTagName(c);
    } else if (this._state === BEFORE_CLOSING_TAG_NAME) {
      this._stateBeforeCloseingTagName(c);
    } else if (this._state === IN_CLOSING_TAG_NAME) {
      this._stateInCloseingTagName(c);
    } else if (this._state === AFTER_CLOSING_TAG_NAME) {
      this._stateAfterCloseingTagName(c);
    } else if (this._state === IN_SELF_CLOSING_TAG) {
      this._stateInSelfClosingTag(c);
    } else if (this._state === BEFORE_ATTRIBUTE_NAME) {
      this._stateBeforeAttributeName(c);
    } else if (this._state === IN_ATTRIBUTE_NAME) {
      this._stateInAttributeName(c);
    } else if (this._state === AFTER_ATTRIBUTE_NAME) {
      this._stateAfterAttributeName(c);
    } else if (this._state === BEFORE_ATTRIBUTE_VALUE) {
      this._stateBeforeAttributeValue(c);
    } else if (this._state === IN_ATTRIBUTE_VALUE_DQ) {
      this._stateInAttributeValueDoubleQuotes(c);
    } else if (this._state === IN_ATTRIBUTE_VALUE_SQ) {
      this._stateInAttributeValueSingleQuotes(c);
    } else if (this._state === IN_ATTRIBUTE_VALUE_NQ) {
      this._stateInAttributeValueNoQuotes(c);
    } else if (this._state === BEFORE_DECLARATION) {
      this._stateBeforeDeclaration(c);
    } else if (this._state === IN_DECLARATION) {
      this._stateInDeclaration(c);
    } else if (this._state === IN_PROCESSING_INSTRUCTION) {
      this._stateInProcessingInstruction(c);
    } else if (this._state === BEFORE_COMMENT) {
      this._stateBeforeComment(c);
    } else if (this._state === IN_COMMENT) {
      this._stateInComment(c);
    } else if (this._state === AFTER_COMMENT_1) {
      this._stateAfterComment1(c);
    } else if (this._state === AFTER_COMMENT_2) {
      this._stateAfterComment2(c);
    } else if (this._state === BEFORE_CDATA_1) {
      this._stateBeforeCdata1(c);
    } else if (this._state === BEFORE_CDATA_2) {
      this._stateBeforeCdata2(c);
    } else if (this._state === BEFORE_CDATA_3) {
      this._stateBeforeCdata3(c);
    } else if (this._state === BEFORE_CDATA_4) {
      this._stateBeforeCdata4(c);
    } else if (this._state === BEFORE_CDATA_5) {
      this._stateBeforeCdata5(c);
    } else if (this._state === BEFORE_CDATA_6) {
      this._stateBeforeCdata6(c);
    } else if (this._state === IN_CDATA) {
      this._stateInCdata(c);
    } else if (this._state === AFTER_CDATA_1) {
      this._stateAfterCdata1(c);
    } else if (this._state === AFTER_CDATA_2) {
      this._stateAfterCdata2(c);
    } else if (this._state === BEFORE_SPECIAL) {
      this._stateBeforeSpecial(c);
    } else if (this._state === BEFORE_SPECIAL_END) {
      this._stateBeforeSpecialEnd(c);
    } else if (this._state === BEFORE_SCRIPT_1) {
      this._stateBeforeScript1(c);
    } else if (this._state === BEFORE_SCRIPT_2) {
      this._stateBeforeScript2(c);
    } else if (this._state === BEFORE_SCRIPT_3) {
      this._stateBeforeScript3(c);
    } else if (this._state === BEFORE_SCRIPT_4) {
      this._stateBeforeScript4(c);
    } else if (this._state === BEFORE_SCRIPT_5) {
      this._stateBeforeScript5(c);
    } else if (this._state === AFTER_SCRIPT_1) {
      this._stateAfterScript1(c);
    } else if (this._state === AFTER_SCRIPT_2) {
      this._stateAfterScript2(c);
    } else if (this._state === AFTER_SCRIPT_3) {
      this._stateAfterScript3(c);
    } else if (this._state === AFTER_SCRIPT_4) {
      this._stateAfterScript4(c);
    } else if (this._state === AFTER_SCRIPT_5) {
      this._stateAfterScript5(c);
    } else if (this._state === BEFORE_STYLE_1) {
      this._stateBeforeStyle1(c);
    } else if (this._state === BEFORE_STYLE_2) {
      this._stateBeforeStyle2(c);
    } else if (this._state === BEFORE_STYLE_3) {
      this._stateBeforeStyle3(c);
    } else if (this._state === BEFORE_STYLE_4) {
      this._stateBeforeStyle4(c);
    } else if (this._state === AFTER_STYLE_1) {
      this._stateAfterStyle1(c);
    } else if (this._state === AFTER_STYLE_2) {
      this._stateAfterStyle2(c);
    } else if (this._state === AFTER_STYLE_3) {
      this._stateAfterStyle3(c);
    } else if (this._state === AFTER_STYLE_4) {
      this._stateAfterStyle4(c);
    } else if (this._state === BEFORE_ENTITY) {
      this._stateBeforeEntity(c);
    } else if (this._state === BEFORE_NUMERIC_ENTITY) {
      this._stateBeforeNumericEntity(c);
    } else if (this._state === IN_NAMED_ENTITY) {
      this._stateInNamedEntity(c);
    } else if (this._state === IN_NUMERIC_ENTITY) {
      this._stateInNumericEntity(c);
    } else if (this._state === IN_HEX_ENTITY) {
      this._stateInHexEntity(c);
    } else {
      this._cbs.onerror(Error("unknown _state"), this._state);
    }
    this._index++;
  }
  this._cleanup();
};
Tokenizer$1.prototype.pause = function() {
  this._running = false;
};
Tokenizer$1.prototype.resume = function() {
  this._running = true;
  if (this._index < this._buffer.length) {
    this._parse();
  }
  if (this._ended) {
    this._finish();
  }
};
Tokenizer$1.prototype.end = function(chunk) {
  if (this._ended)
    this._cbs.onerror(Error(".end() after done!"));
  if (chunk)
    this.write(chunk);
  this._ended = true;
  if (this._running)
    this._finish();
};
Tokenizer$1.prototype._finish = function() {
  if (this._sectionStart < this._index) {
    this._handleTrailingData();
  }
  this._cbs.onend();
};
Tokenizer$1.prototype._handleTrailingData = function() {
  var data = this._buffer.substr(this._sectionStart);
  if (this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2) {
    this._cbs.oncdata(data);
  } else if (this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2) {
    this._cbs.oncomment(data);
  } else if (this._state === IN_NAMED_ENTITY && !this._xmlMode) {
    this._parseLegacyEntity();
    if (this._sectionStart < this._index) {
      this._state = this._baseState;
      this._handleTrailingData();
    }
  } else if (this._state === IN_NUMERIC_ENTITY && !this._xmlMode) {
    this._decodeNumericEntity(2, 10);
    if (this._sectionStart < this._index) {
      this._state = this._baseState;
      this._handleTrailingData();
    }
  } else if (this._state === IN_HEX_ENTITY && !this._xmlMode) {
    this._decodeNumericEntity(3, 16);
    if (this._sectionStart < this._index) {
      this._state = this._baseState;
      this._handleTrailingData();
    }
  } else if (this._state !== IN_TAG_NAME && this._state !== BEFORE_ATTRIBUTE_NAME && this._state !== BEFORE_ATTRIBUTE_VALUE && this._state !== AFTER_ATTRIBUTE_NAME && this._state !== IN_ATTRIBUTE_NAME && this._state !== IN_ATTRIBUTE_VALUE_SQ && this._state !== IN_ATTRIBUTE_VALUE_DQ && this._state !== IN_ATTRIBUTE_VALUE_NQ && this._state !== IN_CLOSING_TAG_NAME) {
    this._cbs.ontext(data);
  }
};
Tokenizer$1.prototype.reset = function() {
  Tokenizer$1.call(
    this,
    { xmlMode: this._xmlMode, decodeEntities: this._decodeEntities },
    this._cbs
  );
};
Tokenizer$1.prototype.getAbsoluteIndex = function() {
  return this._bufferOffset + this._index;
};
Tokenizer$1.prototype._getSection = function() {
  return this._buffer.substring(this._sectionStart, this._index);
};
Tokenizer$1.prototype._emitToken = function(name) {
  this._cbs[name](this._getSection());
  this._sectionStart = -1;
};
Tokenizer$1.prototype._emitPartial = function(value) {
  if (this._baseState !== TEXT) {
    this._cbs.onattribdata(value);
  } else {
    this._cbs.ontext(value);
  }
};
var inherits_browser = { exports: {} };
if (typeof Object.create === "function") {
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
var events = { exports: {} };
var R = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target2, receiver, args) {
  return Function.prototype.apply.call(target2, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === "function") {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys2(target2) {
    return Object.getOwnPropertyNames(target2).concat(Object.getOwnPropertySymbols(target2));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys2(target2) {
    return Object.getOwnPropertyNames(target2);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn)
    console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once2;
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type2) {
  var args = [];
  for (var i2 = 1; i2 < arguments.length; i2++)
    args.push(arguments[i2]);
  var doError = type2 === "error";
  var events2 = this._events;
  if (events2 !== void 0)
    doError = doError && events2.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  var handler = events2[type2];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i2 = 0; i2 < len; ++i2)
      ReflectApply(listeners2[i2], this, args);
  }
  return true;
};
function _addListener(target2, type2, listener, prepend) {
  var m;
  var events2;
  var existing;
  checkListener(listener);
  events2 = target2._events;
  if (events2 === void 0) {
    events2 = target2._events = /* @__PURE__ */ Object.create(null);
    target2._eventsCount = 0;
  } else {
    if (events2.newListener !== void 0) {
      target2.emit(
        "newListener",
        type2,
        listener.listener ? listener.listener : listener
      );
      events2 = target2._events;
    }
    existing = events2[type2];
  }
  if (existing === void 0) {
    existing = events2[type2] = listener;
    ++target2._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events2[type2] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
    m = _getMaxListeners(target2);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type2) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      w.name = "MaxListenersExceededWarning";
      w.emitter = target2;
      w.type = type2;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target2;
}
EventEmitter.prototype.addListener = function addListener(type2, listener) {
  return _addListener(this, type2, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type2, listener) {
  return _addListener(this, type2, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target2, type2, listener) {
  var state = { fired: false, wrapFn: void 0, target: target2, type: type2, listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type2, listener) {
  checkListener(listener);
  this.on(type2, _onceWrap(this, type2, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type2, listener) {
  checkListener(listener);
  this.prependListener(type2, _onceWrap(this, type2, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(type2, listener) {
  var list, events2, position, i2, originalListener;
  checkListener(listener);
  events2 = this._events;
  if (events2 === void 0)
    return this;
  list = events2[type2];
  if (list === void 0)
    return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = /* @__PURE__ */ Object.create(null);
    else {
      delete events2[type2];
      if (events2.removeListener)
        this.emit("removeListener", type2, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position = -1;
    for (i2 = list.length - 1; i2 >= 0; i2--) {
      if (list[i2] === listener || list[i2].listener === listener) {
        originalListener = list[i2].listener;
        position = i2;
        break;
      }
    }
    if (position < 0)
      return this;
    if (position === 0)
      list.shift();
    else {
      spliceOne(list, position);
    }
    if (list.length === 1)
      events2[type2] = list[0];
    if (events2.removeListener !== void 0)
      this.emit("removeListener", type2, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type2) {
  var listeners2, events2, i2;
  events2 = this._events;
  if (events2 === void 0)
    return this;
  if (events2.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    } else if (events2[type2] !== void 0) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else
        delete events2[type2];
    }
    return this;
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events2);
    var key;
    for (i2 = 0; i2 < keys.length; ++i2) {
      key = keys[i2];
      if (key === "removeListener")
        continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners2 = events2[type2];
  if (typeof listeners2 === "function") {
    this.removeListener(type2, listeners2);
  } else if (listeners2 !== void 0) {
    for (i2 = listeners2.length - 1; i2 >= 0; i2--) {
      this.removeListener(type2, listeners2[i2]);
    }
  }
  return this;
};
function _listeners(target2, type2, unwrap) {
  var events2 = target2._events;
  if (events2 === void 0)
    return [];
  var evlistener = events2[type2];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type2) {
  return _listeners(this, type2, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type2) {
  return _listeners(this, type2, false);
};
EventEmitter.listenerCount = function(emitter, type2) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type2);
  } else {
    return listenerCount.call(emitter, type2);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type2) {
  var events2 = this._events;
  if (events2 !== void 0) {
    var evlistener = events2[type2];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener !== void 0) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy2 = new Array(n);
  for (var i2 = 0; i2 < n; ++i2)
    copy2[i2] = arr[i2];
  return copy2;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i2 = 0; i2 < ret.length; ++i2) {
    ret[i2] = arr[i2].listener || arr[i2];
  }
  return ret;
}
function once2(emitter, name) {
  return new Promise(function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === "function") {
        emitter.removeListener("error", errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== "error") {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === "function") {
    eventTargetAgnosticAddListener(emitter, "error", handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === "function") {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === "function") {
    emitter.addEventListener(name, function wrapListener(arg) {
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
var Tokenizer = Tokenizer_1;
var formTags = {
  input: true,
  option: true,
  optgroup: true,
  select: true,
  button: true,
  datalist: true,
  textarea: true
};
var openImpliesClose = {
  tr: { tr: true, th: true, td: true },
  th: { th: true },
  td: { thead: true, th: true, td: true },
  body: { head: true, link: true, script: true },
  li: { li: true },
  p: { p: true },
  h1: { p: true },
  h2: { p: true },
  h3: { p: true },
  h4: { p: true },
  h5: { p: true },
  h6: { p: true },
  select: formTags,
  input: formTags,
  output: formTags,
  button: formTags,
  datalist: formTags,
  textarea: formTags,
  option: { option: true },
  optgroup: { optgroup: true }
};
var voidElements = {
  __proto__: null,
  area: true,
  base: true,
  basefont: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  isindex: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
var foreignContextElements = {
  __proto__: null,
  math: true,
  svg: true
};
var htmlIntegrationElements = {
  __proto__: null,
  mi: true,
  mo: true,
  mn: true,
  ms: true,
  mtext: true,
  "annotation-xml": true,
  foreignObject: true,
  desc: true,
  title: true
};
var re_nameEnd = /\s|\//;
function Parser(cbs, options) {
  this._options = options || {};
  this._cbs = cbs || {};
  this._tagname = "";
  this._attribname = "";
  this._attribvalue = "";
  this._attribs = null;
  this._stack = [];
  this._foreignContext = [];
  this.startIndex = 0;
  this.endIndex = null;
  this._lowerCaseTagNames = "lowerCaseTags" in this._options ? !!this._options.lowerCaseTags : !this._options.xmlMode;
  this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ? !!this._options.lowerCaseAttributeNames : !this._options.xmlMode;
  if (this._options.Tokenizer) {
    Tokenizer = this._options.Tokenizer;
  }
  this._tokenizer = new Tokenizer(this._options, this);
  if (this._cbs.onparserinit)
    this._cbs.onparserinit(this);
}
inherits_browser.exports(Parser, events.exports.EventEmitter);
Parser.prototype._updatePosition = function(initialOffset) {
  if (this.endIndex === null) {
    if (this._tokenizer._sectionStart <= initialOffset) {
      this.startIndex = 0;
    } else {
      this.startIndex = this._tokenizer._sectionStart - initialOffset;
    }
  } else
    this.startIndex = this.endIndex + 1;
  this.endIndex = this._tokenizer.getAbsoluteIndex();
};
Parser.prototype.ontext = function(data) {
  this._updatePosition(1);
  this.endIndex--;
  if (this._cbs.ontext)
    this._cbs.ontext(data);
};
Parser.prototype.onopentagname = function(name) {
  if (this._lowerCaseTagNames) {
    name = name.toLowerCase();
  }
  this._tagname = name;
  if (!this._options.xmlMode && name in openImpliesClose) {
    for (var el2; (el2 = this._stack[this._stack.length - 1]) in openImpliesClose[name]; this.onclosetag(el2))
      ;
  }
  if (this._options.xmlMode || !(name in voidElements)) {
    this._stack.push(name);
    if (name in foreignContextElements)
      this._foreignContext.push(true);
    else if (name in htmlIntegrationElements)
      this._foreignContext.push(false);
  }
  if (this._cbs.onopentagname)
    this._cbs.onopentagname(name);
  if (this._cbs.onopentag)
    this._attribs = {};
};
Parser.prototype.onopentagend = function() {
  this._updatePosition(1);
  if (this._attribs) {
    if (this._cbs.onopentag)
      this._cbs.onopentag(this._tagname, this._attribs);
    this._attribs = null;
  }
  if (!this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements) {
    this._cbs.onclosetag(this._tagname);
  }
  this._tagname = "";
};
Parser.prototype.onclosetag = function(name) {
  this._updatePosition(1);
  if (this._lowerCaseTagNames) {
    name = name.toLowerCase();
  }
  if (name in foreignContextElements || name in htmlIntegrationElements) {
    this._foreignContext.pop();
  }
  if (this._stack.length && (!(name in voidElements) || this._options.xmlMode)) {
    var pos = this._stack.lastIndexOf(name);
    if (pos !== -1) {
      if (this._cbs.onclosetag) {
        pos = this._stack.length - pos;
        while (pos--)
          this._cbs.onclosetag(this._stack.pop());
      } else
        this._stack.length = pos;
    } else if (name === "p" && !this._options.xmlMode) {
      this.onopentagname(name);
      this._closeCurrentTag();
    }
  } else if (!this._options.xmlMode && (name === "br" || name === "p")) {
    this.onopentagname(name);
    this._closeCurrentTag();
  }
};
Parser.prototype.onselfclosingtag = function() {
  if (this._options.xmlMode || this._options.recognizeSelfClosing || this._foreignContext[this._foreignContext.length - 1]) {
    this._closeCurrentTag();
  } else {
    this.onopentagend();
  }
};
Parser.prototype._closeCurrentTag = function() {
  var name = this._tagname;
  this.onopentagend();
  if (this._stack[this._stack.length - 1] === name) {
    if (this._cbs.onclosetag) {
      this._cbs.onclosetag(name);
    }
    this._stack.pop();
  }
};
Parser.prototype.onattribname = function(name) {
  if (this._lowerCaseAttributeNames) {
    name = name.toLowerCase();
  }
  this._attribname = name;
};
Parser.prototype.onattribdata = function(value) {
  this._attribvalue += value;
};
Parser.prototype.onattribend = function() {
  if (this._cbs.onattribute)
    this._cbs.onattribute(this._attribname, this._attribvalue);
  if (this._attribs && !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)) {
    this._attribs[this._attribname] = this._attribvalue;
  }
  this._attribname = "";
  this._attribvalue = "";
};
Parser.prototype._getInstructionName = function(value) {
  var idx = value.search(re_nameEnd), name = idx < 0 ? value : value.substr(0, idx);
  if (this._lowerCaseTagNames) {
    name = name.toLowerCase();
  }
  return name;
};
Parser.prototype.ondeclaration = function(value) {
  if (this._cbs.onprocessinginstruction) {
    var name = this._getInstructionName(value);
    this._cbs.onprocessinginstruction("!" + name, "!" + value);
  }
};
Parser.prototype.onprocessinginstruction = function(value) {
  if (this._cbs.onprocessinginstruction) {
    var name = this._getInstructionName(value);
    this._cbs.onprocessinginstruction("?" + name, "?" + value);
  }
};
Parser.prototype.oncomment = function(value) {
  this._updatePosition(4);
  if (this._cbs.oncomment)
    this._cbs.oncomment(value);
  if (this._cbs.oncommentend)
    this._cbs.oncommentend();
};
Parser.prototype.oncdata = function(value) {
  this._updatePosition(1);
  if (this._options.xmlMode || this._options.recognizeCDATA) {
    if (this._cbs.oncdatastart)
      this._cbs.oncdatastart();
    if (this._cbs.ontext)
      this._cbs.ontext(value);
    if (this._cbs.oncdataend)
      this._cbs.oncdataend();
  } else {
    this.oncomment("[CDATA[" + value + "]]");
  }
};
Parser.prototype.onerror = function(err) {
  if (this._cbs.onerror)
    this._cbs.onerror(err);
};
Parser.prototype.onend = function() {
  if (this._cbs.onclosetag) {
    for (var i2 = this._stack.length; i2 > 0; this._cbs.onclosetag(this._stack[--i2]))
      ;
  }
  if (this._cbs.onend)
    this._cbs.onend();
};
Parser.prototype.reset = function() {
  if (this._cbs.onreset)
    this._cbs.onreset();
  this._tokenizer.reset();
  this._tagname = "";
  this._attribname = "";
  this._attribs = null;
  this._stack = [];
  if (this._cbs.onparserinit)
    this._cbs.onparserinit(this);
};
Parser.prototype.parseComplete = function(data) {
  this.reset();
  this.end(data);
};
Parser.prototype.write = function(chunk) {
  this._tokenizer.write(chunk);
};
Parser.prototype.end = function(chunk) {
  this._tokenizer.end(chunk);
};
Parser.prototype.pause = function() {
  this._tokenizer.pause();
};
Parser.prototype.resume = function() {
  this._tokenizer.resume();
};
Parser.prototype.parseChunk = Parser.prototype.write;
Parser.prototype.done = Parser.prototype.end;
var Parser_1 = Parser;
var domelementtype = {
  Text: "text",
  Directive: "directive",
  Comment: "comment",
  Script: "script",
  Style: "style",
  Tag: "tag",
  CDATA: "cdata",
  Doctype: "doctype",
  isTag: function(elem) {
    return elem.type === "tag" || elem.type === "script" || elem.type === "style";
  }
};
var node = { exports: {} };
node.exports = {
  get firstChild() {
    var children = this.children;
    return children && children[0] || null;
  },
  get lastChild() {
    var children = this.children;
    return children && children[children.length - 1] || null;
  },
  get nodeType() {
    return nodeTypes[this.type] || nodeTypes.element;
  }
};
var domLvl1$1 = {
  tagName: "name",
  childNodes: "children",
  parentNode: "parent",
  previousSibling: "prev",
  nextSibling: "next",
  nodeValue: "data"
};
var nodeTypes = {
  element: 1,
  text: 3,
  cdata: 4,
  comment: 8
};
Object.keys(domLvl1$1).forEach(function(key) {
  domLvl1$1[key];
});
var element = { exports: {} };
var NodePrototype$1 = node.exports;
var ElementPrototype$1 = element.exports = Object.create(NodePrototype$1);
var domLvl1 = {
  tagName: "name"
};
Object.keys(domLvl1).forEach(function(key) {
  var shorthand = domLvl1[key];
  Object.defineProperty(ElementPrototype$1, key, {
    get: function() {
      return this[shorthand] || null;
    },
    set: function(val) {
      this[shorthand] = val;
      return val;
    }
  });
});
var ElementType = domelementtype;
var re_whitespace = /\s+/g;
var NodePrototype = node.exports;
var ElementPrototype = element.exports;
function DomHandler(callback, options, elementCB) {
  if (typeof callback === "object") {
    elementCB = options;
    options = callback;
    callback = null;
  } else if (typeof options === "function") {
    elementCB = options;
    options = defaultOpts;
  }
  this._callback = callback;
  this._options = options || defaultOpts;
  this._elementCB = elementCB;
  this.dom = [];
  this._done = false;
  this._tagStack = [];
  this._parser = this._parser || null;
}
var defaultOpts = {
  normalizeWhitespace: false,
  withStartIndices: false,
  withEndIndices: false
};
DomHandler.prototype.onparserinit = function(parser) {
  this._parser = parser;
};
DomHandler.prototype.onreset = function() {
  DomHandler.call(this, this._callback, this._options, this._elementCB);
};
DomHandler.prototype.onend = function() {
  if (this._done)
    return;
  this._done = true;
  this._parser = null;
  this._handleCallback(null);
};
DomHandler.prototype._handleCallback = DomHandler.prototype.onerror = function(error) {
  if (typeof this._callback === "function") {
    this._callback(error, this.dom);
  } else {
    if (error)
      throw error;
  }
};
DomHandler.prototype.onclosetag = function() {
  var elem = this._tagStack.pop();
  if (this._options.withEndIndices && elem) {
    elem.endIndex = this._parser.endIndex;
  }
  if (this._elementCB)
    this._elementCB(elem);
};
DomHandler.prototype._createDomElement = function(properties) {
  if (!this._options.withDomLvl1)
    return properties;
  var element2;
  if (properties.type === "tag") {
    element2 = Object.create(ElementPrototype);
  } else {
    element2 = Object.create(NodePrototype);
  }
  for (var key in properties) {
    if (properties.hasOwnProperty(key)) {
      element2[key] = properties[key];
    }
  }
  return element2;
};
DomHandler.prototype._addDomElement = function(element2) {
  var parent = this._tagStack[this._tagStack.length - 1];
  var siblings = parent ? parent.children : this.dom;
  var previousSibling = siblings[siblings.length - 1];
  element2.next = null;
  if (this._options.withStartIndices) {
    element2.startIndex = this._parser.startIndex;
  }
  if (this._options.withEndIndices) {
    element2.endIndex = this._parser.endIndex;
  }
  if (previousSibling) {
    element2.prev = previousSibling;
    previousSibling.next = element2;
  } else {
    element2.prev = null;
  }
  siblings.push(element2);
  element2.parent = parent || null;
};
DomHandler.prototype.onopentag = function(name, attribs) {
  var properties = {
    type: name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag,
    name,
    attribs,
    children: []
  };
  var element2 = this._createDomElement(properties);
  this._addDomElement(element2);
  this._tagStack.push(element2);
};
DomHandler.prototype.ontext = function(data) {
  var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;
  var lastTag;
  if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === ElementType.Text) {
    if (normalize) {
      lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
    } else {
      lastTag.data += data;
    }
  } else {
    if (this._tagStack.length && (lastTag = this._tagStack[this._tagStack.length - 1]) && (lastTag = lastTag.children[lastTag.children.length - 1]) && lastTag.type === ElementType.Text) {
      if (normalize) {
        lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
      } else {
        lastTag.data += data;
      }
    } else {
      if (normalize) {
        data = data.replace(re_whitespace, " ");
      }
      var element2 = this._createDomElement({
        data,
        type: ElementType.Text
      });
      this._addDomElement(element2);
    }
  }
};
DomHandler.prototype.oncomment = function(data) {
  var lastTag = this._tagStack[this._tagStack.length - 1];
  if (lastTag && lastTag.type === ElementType.Comment) {
    lastTag.data += data;
    return;
  }
  var properties = {
    data,
    type: ElementType.Comment
  };
  var element2 = this._createDomElement(properties);
  this._addDomElement(element2);
  this._tagStack.push(element2);
};
DomHandler.prototype.oncdatastart = function() {
  var properties = {
    children: [{
      data: "",
      type: ElementType.Text
    }],
    type: ElementType.CDATA
  };
  var element2 = this._createDomElement(properties);
  this._addDomElement(element2);
  this._tagStack.push(element2);
};
DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function() {
  this._tagStack.pop();
};
DomHandler.prototype.onprocessinginstruction = function(name, data) {
  var element2 = this._createDomElement({
    name,
    data,
    type: ElementType.Directive
  });
  this._addDomElement(element2);
};
var domhandler = DomHandler;
var domutils = { exports: {} };
var domSerializer = { exports: {} };
var lib$1 = {};
var hasRequiredLib$2;
function requireLib$2() {
  if (hasRequiredLib$2)
    return lib$1;
  hasRequiredLib$2 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
    var ElementType2;
    (function(ElementType3) {
      ElementType3["Root"] = "root";
      ElementType3["Text"] = "text";
      ElementType3["Directive"] = "directive";
      ElementType3["Comment"] = "comment";
      ElementType3["Script"] = "script";
      ElementType3["Style"] = "style";
      ElementType3["Tag"] = "tag";
      ElementType3["CDATA"] = "cdata";
      ElementType3["Doctype"] = "doctype";
    })(ElementType2 = exports.ElementType || (exports.ElementType = {}));
    function isTag(elem) {
      return elem.type === ElementType2.Tag || elem.type === ElementType2.Script || elem.type === ElementType2.Style;
    }
    exports.isTag = isTag;
    exports.Root = ElementType2.Root;
    exports.Text = ElementType2.Text;
    exports.Directive = ElementType2.Directive;
    exports.Comment = ElementType2.Comment;
    exports.Script = ElementType2.Script;
    exports.Style = ElementType2.Style;
    exports.Tag = ElementType2.Tag;
    exports.CDATA = ElementType2.CDATA;
    exports.Doctype = ElementType2.Doctype;
  })(lib$1);
  return lib$1;
}
var lib = {};
var decode2 = {};
const Aacute$1 = "\xC1";
const aacute$1 = "\xE1";
const Abreve = "\u0102";
const abreve = "\u0103";
const ac = "\u223E";
const acd = "\u223F";
const acE = "\u223E\u0333";
const Acirc$1 = "\xC2";
const acirc$1 = "\xE2";
const acute$1 = "\xB4";
const Acy = "\u0410";
const acy = "\u0430";
const AElig$1 = "\xC6";
const aelig$1 = "\xE6";
const af = "\u2061";
const Afr = "\u{1D504}";
const afr = "\u{1D51E}";
const Agrave$1 = "\xC0";
const agrave$1 = "\xE0";
const alefsym = "\u2135";
const aleph = "\u2135";
const Alpha = "\u0391";
const alpha = "\u03B1";
const Amacr = "\u0100";
const amacr = "\u0101";
const amalg = "\u2A3F";
const amp$2 = "&";
const AMP$1 = "&";
const andand = "\u2A55";
const And = "\u2A53";
const and = "\u2227";
const andd = "\u2A5C";
const andslope = "\u2A58";
const andv = "\u2A5A";
const ang = "\u2220";
const ange = "\u29A4";
const angle = "\u2220";
const angmsdaa = "\u29A8";
const angmsdab = "\u29A9";
const angmsdac = "\u29AA";
const angmsdad = "\u29AB";
const angmsdae = "\u29AC";
const angmsdaf = "\u29AD";
const angmsdag = "\u29AE";
const angmsdah = "\u29AF";
const angmsd = "\u2221";
const angrt = "\u221F";
const angrtvb = "\u22BE";
const angrtvbd = "\u299D";
const angsph = "\u2222";
const angst = "\xC5";
const angzarr = "\u237C";
const Aogon = "\u0104";
const aogon = "\u0105";
const Aopf = "\u{1D538}";
const aopf = "\u{1D552}";
const apacir = "\u2A6F";
const ap = "\u2248";
const apE = "\u2A70";
const ape = "\u224A";
const apid = "\u224B";
const apos$1 = "'";
const ApplyFunction = "\u2061";
const approx = "\u2248";
const approxeq = "\u224A";
const Aring$1 = "\xC5";
const aring$1 = "\xE5";
const Ascr = "\u{1D49C}";
const ascr = "\u{1D4B6}";
const Assign = "\u2254";
const ast = "*";
const asymp = "\u2248";
const asympeq = "\u224D";
const Atilde$1 = "\xC3";
const atilde$1 = "\xE3";
const Auml$1 = "\xC4";
const auml$1 = "\xE4";
const awconint = "\u2233";
const awint = "\u2A11";
const backcong = "\u224C";
const backepsilon = "\u03F6";
const backprime = "\u2035";
const backsim = "\u223D";
const backsimeq = "\u22CD";
const Backslash = "\u2216";
const Barv = "\u2AE7";
const barvee = "\u22BD";
const barwed = "\u2305";
const Barwed = "\u2306";
const barwedge = "\u2305";
const bbrk = "\u23B5";
const bbrktbrk = "\u23B6";
const bcong = "\u224C";
const Bcy = "\u0411";
const bcy = "\u0431";
const bdquo = "\u201E";
const becaus = "\u2235";
const because = "\u2235";
const Because = "\u2235";
const bemptyv = "\u29B0";
const bepsi = "\u03F6";
const bernou = "\u212C";
const Bernoullis = "\u212C";
const Beta = "\u0392";
const beta = "\u03B2";
const beth = "\u2136";
const between = "\u226C";
const Bfr = "\u{1D505}";
const bfr = "\u{1D51F}";
const bigcap = "\u22C2";
const bigcirc = "\u25EF";
const bigcup = "\u22C3";
const bigodot = "\u2A00";
const bigoplus = "\u2A01";
const bigotimes = "\u2A02";
const bigsqcup = "\u2A06";
const bigstar = "\u2605";
const bigtriangledown = "\u25BD";
const bigtriangleup = "\u25B3";
const biguplus = "\u2A04";
const bigvee = "\u22C1";
const bigwedge = "\u22C0";
const bkarow = "\u290D";
const blacklozenge = "\u29EB";
const blacksquare = "\u25AA";
const blacktriangle = "\u25B4";
const blacktriangledown = "\u25BE";
const blacktriangleleft = "\u25C2";
const blacktriangleright = "\u25B8";
const blank = "\u2423";
const blk12 = "\u2592";
const blk14 = "\u2591";
const blk34 = "\u2593";
const block = "\u2588";
const bne = "=\u20E5";
const bnequiv = "\u2261\u20E5";
const bNot = "\u2AED";
const bnot = "\u2310";
const Bopf = "\u{1D539}";
const bopf = "\u{1D553}";
const bot = "\u22A5";
const bottom = "\u22A5";
const bowtie = "\u22C8";
const boxbox = "\u29C9";
const boxdl = "\u2510";
const boxdL = "\u2555";
const boxDl = "\u2556";
const boxDL = "\u2557";
const boxdr = "\u250C";
const boxdR = "\u2552";
const boxDr = "\u2553";
const boxDR = "\u2554";
const boxh = "\u2500";
const boxH = "\u2550";
const boxhd = "\u252C";
const boxHd = "\u2564";
const boxhD = "\u2565";
const boxHD = "\u2566";
const boxhu = "\u2534";
const boxHu = "\u2567";
const boxhU = "\u2568";
const boxHU = "\u2569";
const boxminus = "\u229F";
const boxplus = "\u229E";
const boxtimes = "\u22A0";
const boxul = "\u2518";
const boxuL = "\u255B";
const boxUl = "\u255C";
const boxUL = "\u255D";
const boxur = "\u2514";
const boxuR = "\u2558";
const boxUr = "\u2559";
const boxUR = "\u255A";
const boxv = "\u2502";
const boxV = "\u2551";
const boxvh = "\u253C";
const boxvH = "\u256A";
const boxVh = "\u256B";
const boxVH = "\u256C";
const boxvl = "\u2524";
const boxvL = "\u2561";
const boxVl = "\u2562";
const boxVL = "\u2563";
const boxvr = "\u251C";
const boxvR = "\u255E";
const boxVr = "\u255F";
const boxVR = "\u2560";
const bprime = "\u2035";
const breve = "\u02D8";
const Breve = "\u02D8";
const brvbar$1 = "\xA6";
const bscr = "\u{1D4B7}";
const Bscr = "\u212C";
const bsemi = "\u204F";
const bsim = "\u223D";
const bsime = "\u22CD";
const bsolb = "\u29C5";
const bsol = "\\";
const bsolhsub = "\u27C8";
const bull = "\u2022";
const bullet = "\u2022";
const bump = "\u224E";
const bumpE = "\u2AAE";
const bumpe = "\u224F";
const Bumpeq = "\u224E";
const bumpeq = "\u224F";
const Cacute = "\u0106";
const cacute = "\u0107";
const capand = "\u2A44";
const capbrcup = "\u2A49";
const capcap = "\u2A4B";
const cap = "\u2229";
const Cap = "\u22D2";
const capcup = "\u2A47";
const capdot = "\u2A40";
const CapitalDifferentialD = "\u2145";
const caps = "\u2229\uFE00";
const caret = "\u2041";
const caron = "\u02C7";
const Cayleys = "\u212D";
const ccaps = "\u2A4D";
const Ccaron = "\u010C";
const ccaron = "\u010D";
const Ccedil$1 = "\xC7";
const ccedil$1 = "\xE7";
const Ccirc = "\u0108";
const ccirc = "\u0109";
const Cconint = "\u2230";
const ccups = "\u2A4C";
const ccupssm = "\u2A50";
const Cdot = "\u010A";
const cdot = "\u010B";
const cedil$1 = "\xB8";
const Cedilla = "\xB8";
const cemptyv = "\u29B2";
const cent$1 = "\xA2";
const centerdot = "\xB7";
const CenterDot = "\xB7";
const cfr = "\u{1D520}";
const Cfr = "\u212D";
const CHcy = "\u0427";
const chcy = "\u0447";
const check = "\u2713";
const checkmark = "\u2713";
const Chi = "\u03A7";
const chi = "\u03C7";
const circ = "\u02C6";
const circeq = "\u2257";
const circlearrowleft = "\u21BA";
const circlearrowright = "\u21BB";
const circledast = "\u229B";
const circledcirc = "\u229A";
const circleddash = "\u229D";
const CircleDot = "\u2299";
const circledR = "\xAE";
const circledS = "\u24C8";
const CircleMinus = "\u2296";
const CirclePlus = "\u2295";
const CircleTimes = "\u2297";
const cir = "\u25CB";
const cirE = "\u29C3";
const cire = "\u2257";
const cirfnint = "\u2A10";
const cirmid = "\u2AEF";
const cirscir = "\u29C2";
const ClockwiseContourIntegral = "\u2232";
const CloseCurlyDoubleQuote = "\u201D";
const CloseCurlyQuote = "\u2019";
const clubs = "\u2663";
const clubsuit = "\u2663";
const colon = ":";
const Colon = "\u2237";
const Colone = "\u2A74";
const colone = "\u2254";
const coloneq = "\u2254";
const comma = ",";
const commat = "@";
const comp = "\u2201";
const compfn = "\u2218";
const complement = "\u2201";
const complexes = "\u2102";
const cong = "\u2245";
const congdot = "\u2A6D";
const Congruent = "\u2261";
const conint = "\u222E";
const Conint = "\u222F";
const ContourIntegral = "\u222E";
const copf = "\u{1D554}";
const Copf = "\u2102";
const coprod = "\u2210";
const Coproduct = "\u2210";
const copy$1 = "\xA9";
const COPY$1 = "\xA9";
const copysr = "\u2117";
const CounterClockwiseContourIntegral = "\u2233";
const crarr = "\u21B5";
const cross = "\u2717";
const Cross = "\u2A2F";
const Cscr = "\u{1D49E}";
const cscr = "\u{1D4B8}";
const csub = "\u2ACF";
const csube = "\u2AD1";
const csup = "\u2AD0";
const csupe = "\u2AD2";
const ctdot = "\u22EF";
const cudarrl = "\u2938";
const cudarrr = "\u2935";
const cuepr = "\u22DE";
const cuesc = "\u22DF";
const cularr = "\u21B6";
const cularrp = "\u293D";
const cupbrcap = "\u2A48";
const cupcap = "\u2A46";
const CupCap = "\u224D";
const cup = "\u222A";
const Cup = "\u22D3";
const cupcup = "\u2A4A";
const cupdot = "\u228D";
const cupor = "\u2A45";
const cups = "\u222A\uFE00";
const curarr = "\u21B7";
const curarrm = "\u293C";
const curlyeqprec = "\u22DE";
const curlyeqsucc = "\u22DF";
const curlyvee = "\u22CE";
const curlywedge = "\u22CF";
const curren$1 = "\xA4";
const curvearrowleft = "\u21B6";
const curvearrowright = "\u21B7";
const cuvee = "\u22CE";
const cuwed = "\u22CF";
const cwconint = "\u2232";
const cwint = "\u2231";
const cylcty = "\u232D";
const dagger = "\u2020";
const Dagger = "\u2021";
const daleth = "\u2138";
const darr = "\u2193";
const Darr = "\u21A1";
const dArr = "\u21D3";
const dash = "\u2010";
const Dashv = "\u2AE4";
const dashv = "\u22A3";
const dbkarow = "\u290F";
const dblac = "\u02DD";
const Dcaron = "\u010E";
const dcaron = "\u010F";
const Dcy = "\u0414";
const dcy = "\u0434";
const ddagger = "\u2021";
const ddarr = "\u21CA";
const DD = "\u2145";
const dd = "\u2146";
const DDotrahd = "\u2911";
const ddotseq = "\u2A77";
const deg$1 = "\xB0";
const Del = "\u2207";
const Delta = "\u0394";
const delta = "\u03B4";
const demptyv = "\u29B1";
const dfisht = "\u297F";
const Dfr = "\u{1D507}";
const dfr = "\u{1D521}";
const dHar = "\u2965";
const dharl = "\u21C3";
const dharr = "\u21C2";
const DiacriticalAcute = "\xB4";
const DiacriticalDot = "\u02D9";
const DiacriticalDoubleAcute = "\u02DD";
const DiacriticalGrave = "`";
const DiacriticalTilde = "\u02DC";
const diam = "\u22C4";
const diamond = "\u22C4";
const Diamond = "\u22C4";
const diamondsuit = "\u2666";
const diams = "\u2666";
const die = "\xA8";
const DifferentialD = "\u2146";
const digamma = "\u03DD";
const disin = "\u22F2";
const div = "\xF7";
const divide$1 = "\xF7";
const divideontimes = "\u22C7";
const divonx = "\u22C7";
const DJcy = "\u0402";
const djcy = "\u0452";
const dlcorn = "\u231E";
const dlcrop = "\u230D";
const dollar = "$";
const Dopf = "\u{1D53B}";
const dopf = "\u{1D555}";
const Dot = "\xA8";
const dot = "\u02D9";
const DotDot = "\u20DC";
const doteq = "\u2250";
const doteqdot = "\u2251";
const DotEqual = "\u2250";
const dotminus = "\u2238";
const dotplus = "\u2214";
const dotsquare = "\u22A1";
const doublebarwedge = "\u2306";
const DoubleContourIntegral = "\u222F";
const DoubleDot = "\xA8";
const DoubleDownArrow = "\u21D3";
const DoubleLeftArrow = "\u21D0";
const DoubleLeftRightArrow = "\u21D4";
const DoubleLeftTee = "\u2AE4";
const DoubleLongLeftArrow = "\u27F8";
const DoubleLongLeftRightArrow = "\u27FA";
const DoubleLongRightArrow = "\u27F9";
const DoubleRightArrow = "\u21D2";
const DoubleRightTee = "\u22A8";
const DoubleUpArrow = "\u21D1";
const DoubleUpDownArrow = "\u21D5";
const DoubleVerticalBar = "\u2225";
const DownArrowBar = "\u2913";
const downarrow = "\u2193";
const DownArrow = "\u2193";
const Downarrow = "\u21D3";
const DownArrowUpArrow = "\u21F5";
const DownBreve = "\u0311";
const downdownarrows = "\u21CA";
const downharpoonleft = "\u21C3";
const downharpoonright = "\u21C2";
const DownLeftRightVector = "\u2950";
const DownLeftTeeVector = "\u295E";
const DownLeftVectorBar = "\u2956";
const DownLeftVector = "\u21BD";
const DownRightTeeVector = "\u295F";
const DownRightVectorBar = "\u2957";
const DownRightVector = "\u21C1";
const DownTeeArrow = "\u21A7";
const DownTee = "\u22A4";
const drbkarow = "\u2910";
const drcorn = "\u231F";
const drcrop = "\u230C";
const Dscr = "\u{1D49F}";
const dscr = "\u{1D4B9}";
const DScy = "\u0405";
const dscy = "\u0455";
const dsol = "\u29F6";
const Dstrok = "\u0110";
const dstrok = "\u0111";
const dtdot = "\u22F1";
const dtri = "\u25BF";
const dtrif = "\u25BE";
const duarr = "\u21F5";
const duhar = "\u296F";
const dwangle = "\u29A6";
const DZcy = "\u040F";
const dzcy = "\u045F";
const dzigrarr = "\u27FF";
const Eacute$1 = "\xC9";
const eacute$1 = "\xE9";
const easter = "\u2A6E";
const Ecaron = "\u011A";
const ecaron = "\u011B";
const Ecirc$1 = "\xCA";
const ecirc$1 = "\xEA";
const ecir = "\u2256";
const ecolon = "\u2255";
const Ecy = "\u042D";
const ecy = "\u044D";
const eDDot = "\u2A77";
const Edot = "\u0116";
const edot = "\u0117";
const eDot = "\u2251";
const ee = "\u2147";
const efDot = "\u2252";
const Efr = "\u{1D508}";
const efr = "\u{1D522}";
const eg = "\u2A9A";
const Egrave$1 = "\xC8";
const egrave$1 = "\xE8";
const egs = "\u2A96";
const egsdot = "\u2A98";
const el = "\u2A99";
const Element = "\u2208";
const elinters = "\u23E7";
const ell = "\u2113";
const els = "\u2A95";
const elsdot = "\u2A97";
const Emacr = "\u0112";
const emacr = "\u0113";
const empty = "\u2205";
const emptyset = "\u2205";
const EmptySmallSquare = "\u25FB";
const emptyv = "\u2205";
const EmptyVerySmallSquare = "\u25AB";
const emsp13 = "\u2004";
const emsp14 = "\u2005";
const emsp = "\u2003";
const ENG = "\u014A";
const eng = "\u014B";
const ensp = "\u2002";
const Eogon = "\u0118";
const eogon = "\u0119";
const Eopf = "\u{1D53C}";
const eopf = "\u{1D556}";
const epar = "\u22D5";
const eparsl = "\u29E3";
const eplus = "\u2A71";
const epsi = "\u03B5";
const Epsilon = "\u0395";
const epsilon = "\u03B5";
const epsiv = "\u03F5";
const eqcirc = "\u2256";
const eqcolon = "\u2255";
const eqsim = "\u2242";
const eqslantgtr = "\u2A96";
const eqslantless = "\u2A95";
const Equal = "\u2A75";
const equals = "=";
const EqualTilde = "\u2242";
const equest = "\u225F";
const Equilibrium = "\u21CC";
const equiv = "\u2261";
const equivDD = "\u2A78";
const eqvparsl = "\u29E5";
const erarr = "\u2971";
const erDot = "\u2253";
const escr = "\u212F";
const Escr = "\u2130";
const esdot = "\u2250";
const Esim = "\u2A73";
const esim = "\u2242";
const Eta = "\u0397";
const eta = "\u03B7";
const ETH$1 = "\xD0";
const eth$1 = "\xF0";
const Euml$1 = "\xCB";
const euml$1 = "\xEB";
const euro = "\u20AC";
const excl = "!";
const exist = "\u2203";
const Exists = "\u2203";
const expectation = "\u2130";
const exponentiale = "\u2147";
const ExponentialE = "\u2147";
const fallingdotseq = "\u2252";
const Fcy = "\u0424";
const fcy = "\u0444";
const female = "\u2640";
const ffilig = "\uFB03";
const fflig = "\uFB00";
const ffllig = "\uFB04";
const Ffr = "\u{1D509}";
const ffr = "\u{1D523}";
const filig = "\uFB01";
const FilledSmallSquare = "\u25FC";
const FilledVerySmallSquare = "\u25AA";
const fjlig = "fj";
const flat = "\u266D";
const fllig = "\uFB02";
const fltns = "\u25B1";
const fnof = "\u0192";
const Fopf = "\u{1D53D}";
const fopf = "\u{1D557}";
const forall = "\u2200";
const ForAll = "\u2200";
const fork = "\u22D4";
const forkv = "\u2AD9";
const Fouriertrf = "\u2131";
const fpartint = "\u2A0D";
const frac12$1 = "\xBD";
const frac13 = "\u2153";
const frac14$1 = "\xBC";
const frac15 = "\u2155";
const frac16 = "\u2159";
const frac18 = "\u215B";
const frac23 = "\u2154";
const frac25 = "\u2156";
const frac34$1 = "\xBE";
const frac35 = "\u2157";
const frac38 = "\u215C";
const frac45 = "\u2158";
const frac56 = "\u215A";
const frac58 = "\u215D";
const frac78 = "\u215E";
const frasl = "\u2044";
const frown = "\u2322";
const fscr = "\u{1D4BB}";
const Fscr = "\u2131";
const gacute = "\u01F5";
const Gamma = "\u0393";
const gamma = "\u03B3";
const Gammad = "\u03DC";
const gammad = "\u03DD";
const gap = "\u2A86";
const Gbreve = "\u011E";
const gbreve = "\u011F";
const Gcedil = "\u0122";
const Gcirc = "\u011C";
const gcirc = "\u011D";
const Gcy = "\u0413";
const gcy = "\u0433";
const Gdot = "\u0120";
const gdot = "\u0121";
const ge = "\u2265";
const gE = "\u2267";
const gEl = "\u2A8C";
const gel = "\u22DB";
const geq = "\u2265";
const geqq = "\u2267";
const geqslant = "\u2A7E";
const gescc = "\u2AA9";
const ges = "\u2A7E";
const gesdot = "\u2A80";
const gesdoto = "\u2A82";
const gesdotol = "\u2A84";
const gesl = "\u22DB\uFE00";
const gesles = "\u2A94";
const Gfr = "\u{1D50A}";
const gfr = "\u{1D524}";
const gg = "\u226B";
const Gg = "\u22D9";
const ggg = "\u22D9";
const gimel = "\u2137";
const GJcy = "\u0403";
const gjcy = "\u0453";
const gla = "\u2AA5";
const gl = "\u2277";
const glE = "\u2A92";
const glj = "\u2AA4";
const gnap = "\u2A8A";
const gnapprox = "\u2A8A";
const gne = "\u2A88";
const gnE = "\u2269";
const gneq = "\u2A88";
const gneqq = "\u2269";
const gnsim = "\u22E7";
const Gopf = "\u{1D53E}";
const gopf = "\u{1D558}";
const grave = "`";
const GreaterEqual = "\u2265";
const GreaterEqualLess = "\u22DB";
const GreaterFullEqual = "\u2267";
const GreaterGreater = "\u2AA2";
const GreaterLess = "\u2277";
const GreaterSlantEqual = "\u2A7E";
const GreaterTilde = "\u2273";
const Gscr = "\u{1D4A2}";
const gscr = "\u210A";
const gsim = "\u2273";
const gsime = "\u2A8E";
const gsiml = "\u2A90";
const gtcc = "\u2AA7";
const gtcir = "\u2A7A";
const gt$2 = ">";
const GT$1 = ">";
const Gt = "\u226B";
const gtdot = "\u22D7";
const gtlPar = "\u2995";
const gtquest = "\u2A7C";
const gtrapprox = "\u2A86";
const gtrarr = "\u2978";
const gtrdot = "\u22D7";
const gtreqless = "\u22DB";
const gtreqqless = "\u2A8C";
const gtrless = "\u2277";
const gtrsim = "\u2273";
const gvertneqq = "\u2269\uFE00";
const gvnE = "\u2269\uFE00";
const Hacek = "\u02C7";
const hairsp = "\u200A";
const half = "\xBD";
const hamilt = "\u210B";
const HARDcy = "\u042A";
const hardcy = "\u044A";
const harrcir = "\u2948";
const harr = "\u2194";
const hArr = "\u21D4";
const harrw = "\u21AD";
const Hat = "^";
const hbar = "\u210F";
const Hcirc = "\u0124";
const hcirc = "\u0125";
const hearts = "\u2665";
const heartsuit = "\u2665";
const hellip = "\u2026";
const hercon = "\u22B9";
const hfr = "\u{1D525}";
const Hfr = "\u210C";
const HilbertSpace = "\u210B";
const hksearow = "\u2925";
const hkswarow = "\u2926";
const hoarr = "\u21FF";
const homtht = "\u223B";
const hookleftarrow = "\u21A9";
const hookrightarrow = "\u21AA";
const hopf = "\u{1D559}";
const Hopf = "\u210D";
const horbar = "\u2015";
const HorizontalLine = "\u2500";
const hscr = "\u{1D4BD}";
const Hscr = "\u210B";
const hslash = "\u210F";
const Hstrok = "\u0126";
const hstrok = "\u0127";
const HumpDownHump = "\u224E";
const HumpEqual = "\u224F";
const hybull = "\u2043";
const hyphen = "\u2010";
const Iacute$1 = "\xCD";
const iacute$1 = "\xED";
const ic = "\u2063";
const Icirc$1 = "\xCE";
const icirc$1 = "\xEE";
const Icy = "\u0418";
const icy = "\u0438";
const Idot = "\u0130";
const IEcy = "\u0415";
const iecy = "\u0435";
const iexcl$1 = "\xA1";
const iff = "\u21D4";
const ifr = "\u{1D526}";
const Ifr = "\u2111";
const Igrave$1 = "\xCC";
const igrave$1 = "\xEC";
const ii = "\u2148";
const iiiint = "\u2A0C";
const iiint = "\u222D";
const iinfin = "\u29DC";
const iiota = "\u2129";
const IJlig = "\u0132";
const ijlig = "\u0133";
const Imacr = "\u012A";
const imacr = "\u012B";
const image = "\u2111";
const ImaginaryI = "\u2148";
const imagline = "\u2110";
const imagpart = "\u2111";
const imath = "\u0131";
const Im = "\u2111";
const imof = "\u22B7";
const imped = "\u01B5";
const Implies = "\u21D2";
const incare = "\u2105";
const infin = "\u221E";
const infintie = "\u29DD";
const inodot = "\u0131";
const intcal = "\u22BA";
const int = "\u222B";
const Int = "\u222C";
const integers = "\u2124";
const Integral = "\u222B";
const intercal = "\u22BA";
const Intersection = "\u22C2";
const intlarhk = "\u2A17";
const intprod = "\u2A3C";
const InvisibleComma = "\u2063";
const InvisibleTimes = "\u2062";
const IOcy = "\u0401";
const iocy = "\u0451";
const Iogon = "\u012E";
const iogon = "\u012F";
const Iopf = "\u{1D540}";
const iopf = "\u{1D55A}";
const Iota = "\u0399";
const iota = "\u03B9";
const iprod = "\u2A3C";
const iquest$1 = "\xBF";
const iscr = "\u{1D4BE}";
const Iscr = "\u2110";
const isin = "\u2208";
const isindot = "\u22F5";
const isinE = "\u22F9";
const isins = "\u22F4";
const isinsv = "\u22F3";
const isinv = "\u2208";
const it = "\u2062";
const Itilde = "\u0128";
const itilde = "\u0129";
const Iukcy = "\u0406";
const iukcy = "\u0456";
const Iuml$1 = "\xCF";
const iuml$1 = "\xEF";
const Jcirc = "\u0134";
const jcirc = "\u0135";
const Jcy = "\u0419";
const jcy = "\u0439";
const Jfr = "\u{1D50D}";
const jfr = "\u{1D527}";
const jmath = "\u0237";
const Jopf = "\u{1D541}";
const jopf = "\u{1D55B}";
const Jscr = "\u{1D4A5}";
const jscr = "\u{1D4BF}";
const Jsercy = "\u0408";
const jsercy = "\u0458";
const Jukcy = "\u0404";
const jukcy = "\u0454";
const Kappa = "\u039A";
const kappa = "\u03BA";
const kappav = "\u03F0";
const Kcedil = "\u0136";
const kcedil = "\u0137";
const Kcy = "\u041A";
const kcy = "\u043A";
const Kfr = "\u{1D50E}";
const kfr = "\u{1D528}";
const kgreen = "\u0138";
const KHcy = "\u0425";
const khcy = "\u0445";
const KJcy = "\u040C";
const kjcy = "\u045C";
const Kopf = "\u{1D542}";
const kopf = "\u{1D55C}";
const Kscr = "\u{1D4A6}";
const kscr = "\u{1D4C0}";
const lAarr = "\u21DA";
const Lacute = "\u0139";
const lacute = "\u013A";
const laemptyv = "\u29B4";
const lagran = "\u2112";
const Lambda = "\u039B";
const lambda = "\u03BB";
const lang = "\u27E8";
const Lang = "\u27EA";
const langd = "\u2991";
const langle = "\u27E8";
const lap = "\u2A85";
const Laplacetrf = "\u2112";
const laquo$1 = "\xAB";
const larrb = "\u21E4";
const larrbfs = "\u291F";
const larr = "\u2190";
const Larr = "\u219E";
const lArr = "\u21D0";
const larrfs = "\u291D";
const larrhk = "\u21A9";
const larrlp = "\u21AB";
const larrpl = "\u2939";
const larrsim = "\u2973";
const larrtl = "\u21A2";
const latail = "\u2919";
const lAtail = "\u291B";
const lat = "\u2AAB";
const late = "\u2AAD";
const lates = "\u2AAD\uFE00";
const lbarr = "\u290C";
const lBarr = "\u290E";
const lbbrk = "\u2772";
const lbrace = "{";
const lbrack = "[";
const lbrke = "\u298B";
const lbrksld = "\u298F";
const lbrkslu = "\u298D";
const Lcaron = "\u013D";
const lcaron = "\u013E";
const Lcedil = "\u013B";
const lcedil = "\u013C";
const lceil = "\u2308";
const lcub = "{";
const Lcy = "\u041B";
const lcy = "\u043B";
const ldca = "\u2936";
const ldquo = "\u201C";
const ldquor = "\u201E";
const ldrdhar = "\u2967";
const ldrushar = "\u294B";
const ldsh = "\u21B2";
const le = "\u2264";
const lE = "\u2266";
const LeftAngleBracket = "\u27E8";
const LeftArrowBar = "\u21E4";
const leftarrow = "\u2190";
const LeftArrow = "\u2190";
const Leftarrow = "\u21D0";
const LeftArrowRightArrow = "\u21C6";
const leftarrowtail = "\u21A2";
const LeftCeiling = "\u2308";
const LeftDoubleBracket = "\u27E6";
const LeftDownTeeVector = "\u2961";
const LeftDownVectorBar = "\u2959";
const LeftDownVector = "\u21C3";
const LeftFloor = "\u230A";
const leftharpoondown = "\u21BD";
const leftharpoonup = "\u21BC";
const leftleftarrows = "\u21C7";
const leftrightarrow = "\u2194";
const LeftRightArrow = "\u2194";
const Leftrightarrow = "\u21D4";
const leftrightarrows = "\u21C6";
const leftrightharpoons = "\u21CB";
const leftrightsquigarrow = "\u21AD";
const LeftRightVector = "\u294E";
const LeftTeeArrow = "\u21A4";
const LeftTee = "\u22A3";
const LeftTeeVector = "\u295A";
const leftthreetimes = "\u22CB";
const LeftTriangleBar = "\u29CF";
const LeftTriangle = "\u22B2";
const LeftTriangleEqual = "\u22B4";
const LeftUpDownVector = "\u2951";
const LeftUpTeeVector = "\u2960";
const LeftUpVectorBar = "\u2958";
const LeftUpVector = "\u21BF";
const LeftVectorBar = "\u2952";
const LeftVector = "\u21BC";
const lEg = "\u2A8B";
const leg = "\u22DA";
const leq = "\u2264";
const leqq = "\u2266";
const leqslant = "\u2A7D";
const lescc = "\u2AA8";
const les = "\u2A7D";
const lesdot = "\u2A7F";
const lesdoto = "\u2A81";
const lesdotor = "\u2A83";
const lesg = "\u22DA\uFE00";
const lesges = "\u2A93";
const lessapprox = "\u2A85";
const lessdot = "\u22D6";
const lesseqgtr = "\u22DA";
const lesseqqgtr = "\u2A8B";
const LessEqualGreater = "\u22DA";
const LessFullEqual = "\u2266";
const LessGreater = "\u2276";
const lessgtr = "\u2276";
const LessLess = "\u2AA1";
const lesssim = "\u2272";
const LessSlantEqual = "\u2A7D";
const LessTilde = "\u2272";
const lfisht = "\u297C";
const lfloor = "\u230A";
const Lfr = "\u{1D50F}";
const lfr = "\u{1D529}";
const lg = "\u2276";
const lgE = "\u2A91";
const lHar = "\u2962";
const lhard = "\u21BD";
const lharu = "\u21BC";
const lharul = "\u296A";
const lhblk = "\u2584";
const LJcy = "\u0409";
const ljcy = "\u0459";
const llarr = "\u21C7";
const ll = "\u226A";
const Ll = "\u22D8";
const llcorner = "\u231E";
const Lleftarrow = "\u21DA";
const llhard = "\u296B";
const lltri = "\u25FA";
const Lmidot = "\u013F";
const lmidot = "\u0140";
const lmoustache = "\u23B0";
const lmoust = "\u23B0";
const lnap = "\u2A89";
const lnapprox = "\u2A89";
const lne = "\u2A87";
const lnE = "\u2268";
const lneq = "\u2A87";
const lneqq = "\u2268";
const lnsim = "\u22E6";
const loang = "\u27EC";
const loarr = "\u21FD";
const lobrk = "\u27E6";
const longleftarrow = "\u27F5";
const LongLeftArrow = "\u27F5";
const Longleftarrow = "\u27F8";
const longleftrightarrow = "\u27F7";
const LongLeftRightArrow = "\u27F7";
const Longleftrightarrow = "\u27FA";
const longmapsto = "\u27FC";
const longrightarrow = "\u27F6";
const LongRightArrow = "\u27F6";
const Longrightarrow = "\u27F9";
const looparrowleft = "\u21AB";
const looparrowright = "\u21AC";
const lopar = "\u2985";
const Lopf = "\u{1D543}";
const lopf = "\u{1D55D}";
const loplus = "\u2A2D";
const lotimes = "\u2A34";
const lowast = "\u2217";
const lowbar = "_";
const LowerLeftArrow = "\u2199";
const LowerRightArrow = "\u2198";
const loz = "\u25CA";
const lozenge = "\u25CA";
const lozf = "\u29EB";
const lpar = "(";
const lparlt = "\u2993";
const lrarr = "\u21C6";
const lrcorner = "\u231F";
const lrhar = "\u21CB";
const lrhard = "\u296D";
const lrm = "\u200E";
const lrtri = "\u22BF";
const lsaquo = "\u2039";
const lscr = "\u{1D4C1}";
const Lscr = "\u2112";
const lsh = "\u21B0";
const Lsh = "\u21B0";
const lsim = "\u2272";
const lsime = "\u2A8D";
const lsimg = "\u2A8F";
const lsqb = "[";
const lsquo = "\u2018";
const lsquor = "\u201A";
const Lstrok = "\u0141";
const lstrok = "\u0142";
const ltcc = "\u2AA6";
const ltcir = "\u2A79";
const lt$2 = "<";
const LT$1 = "<";
const Lt = "\u226A";
const ltdot = "\u22D6";
const lthree = "\u22CB";
const ltimes = "\u22C9";
const ltlarr = "\u2976";
const ltquest = "\u2A7B";
const ltri = "\u25C3";
const ltrie = "\u22B4";
const ltrif = "\u25C2";
const ltrPar = "\u2996";
const lurdshar = "\u294A";
const luruhar = "\u2966";
const lvertneqq = "\u2268\uFE00";
const lvnE = "\u2268\uFE00";
const macr$1 = "\xAF";
const male = "\u2642";
const malt = "\u2720";
const maltese = "\u2720";
const map = "\u21A6";
const mapsto = "\u21A6";
const mapstodown = "\u21A7";
const mapstoleft = "\u21A4";
const mapstoup = "\u21A5";
const marker = "\u25AE";
const mcomma = "\u2A29";
const Mcy = "\u041C";
const mcy = "\u043C";
const mdash = "\u2014";
const mDDot = "\u223A";
const measuredangle = "\u2221";
const MediumSpace = "\u205F";
const Mellintrf = "\u2133";
const Mfr = "\u{1D510}";
const mfr = "\u{1D52A}";
const mho = "\u2127";
const micro$1 = "\xB5";
const midast = "*";
const midcir = "\u2AF0";
const mid = "\u2223";
const middot$1 = "\xB7";
const minusb = "\u229F";
const minus = "\u2212";
const minusd = "\u2238";
const minusdu = "\u2A2A";
const MinusPlus = "\u2213";
const mlcp = "\u2ADB";
const mldr = "\u2026";
const mnplus = "\u2213";
const models = "\u22A7";
const Mopf = "\u{1D544}";
const mopf = "\u{1D55E}";
const mp = "\u2213";
const mscr = "\u{1D4C2}";
const Mscr = "\u2133";
const mstpos = "\u223E";
const Mu = "\u039C";
const mu = "\u03BC";
const multimap = "\u22B8";
const mumap = "\u22B8";
const nabla = "\u2207";
const Nacute = "\u0143";
const nacute = "\u0144";
const nang = "\u2220\u20D2";
const nap = "\u2249";
const napE = "\u2A70\u0338";
const napid = "\u224B\u0338";
const napos = "\u0149";
const napprox = "\u2249";
const natural = "\u266E";
const naturals = "\u2115";
const natur = "\u266E";
const nbsp$1 = "\xA0";
const nbump = "\u224E\u0338";
const nbumpe = "\u224F\u0338";
const ncap = "\u2A43";
const Ncaron = "\u0147";
const ncaron = "\u0148";
const Ncedil = "\u0145";
const ncedil = "\u0146";
const ncong = "\u2247";
const ncongdot = "\u2A6D\u0338";
const ncup = "\u2A42";
const Ncy = "\u041D";
const ncy = "\u043D";
const ndash = "\u2013";
const nearhk = "\u2924";
const nearr = "\u2197";
const neArr = "\u21D7";
const nearrow = "\u2197";
const ne = "\u2260";
const nedot = "\u2250\u0338";
const NegativeMediumSpace = "\u200B";
const NegativeThickSpace = "\u200B";
const NegativeThinSpace = "\u200B";
const NegativeVeryThinSpace = "\u200B";
const nequiv = "\u2262";
const nesear = "\u2928";
const nesim = "\u2242\u0338";
const NestedGreaterGreater = "\u226B";
const NestedLessLess = "\u226A";
const NewLine = "\n";
const nexist = "\u2204";
const nexists = "\u2204";
const Nfr = "\u{1D511}";
const nfr = "\u{1D52B}";
const ngE = "\u2267\u0338";
const nge = "\u2271";
const ngeq = "\u2271";
const ngeqq = "\u2267\u0338";
const ngeqslant = "\u2A7E\u0338";
const nges = "\u2A7E\u0338";
const nGg = "\u22D9\u0338";
const ngsim = "\u2275";
const nGt = "\u226B\u20D2";
const ngt = "\u226F";
const ngtr = "\u226F";
const nGtv = "\u226B\u0338";
const nharr = "\u21AE";
const nhArr = "\u21CE";
const nhpar = "\u2AF2";
const ni = "\u220B";
const nis = "\u22FC";
const nisd = "\u22FA";
const niv = "\u220B";
const NJcy = "\u040A";
const njcy = "\u045A";
const nlarr = "\u219A";
const nlArr = "\u21CD";
const nldr = "\u2025";
const nlE = "\u2266\u0338";
const nle = "\u2270";
const nleftarrow = "\u219A";
const nLeftarrow = "\u21CD";
const nleftrightarrow = "\u21AE";
const nLeftrightarrow = "\u21CE";
const nleq = "\u2270";
const nleqq = "\u2266\u0338";
const nleqslant = "\u2A7D\u0338";
const nles = "\u2A7D\u0338";
const nless = "\u226E";
const nLl = "\u22D8\u0338";
const nlsim = "\u2274";
const nLt = "\u226A\u20D2";
const nlt = "\u226E";
const nltri = "\u22EA";
const nltrie = "\u22EC";
const nLtv = "\u226A\u0338";
const nmid = "\u2224";
const NoBreak = "\u2060";
const NonBreakingSpace = "\xA0";
const nopf = "\u{1D55F}";
const Nopf = "\u2115";
const Not = "\u2AEC";
const not$1 = "\xAC";
const NotCongruent = "\u2262";
const NotCupCap = "\u226D";
const NotDoubleVerticalBar = "\u2226";
const NotElement = "\u2209";
const NotEqual = "\u2260";
const NotEqualTilde = "\u2242\u0338";
const NotExists = "\u2204";
const NotGreater = "\u226F";
const NotGreaterEqual = "\u2271";
const NotGreaterFullEqual = "\u2267\u0338";
const NotGreaterGreater = "\u226B\u0338";
const NotGreaterLess = "\u2279";
const NotGreaterSlantEqual = "\u2A7E\u0338";
const NotGreaterTilde = "\u2275";
const NotHumpDownHump = "\u224E\u0338";
const NotHumpEqual = "\u224F\u0338";
const notin = "\u2209";
const notindot = "\u22F5\u0338";
const notinE = "\u22F9\u0338";
const notinva = "\u2209";
const notinvb = "\u22F7";
const notinvc = "\u22F6";
const NotLeftTriangleBar = "\u29CF\u0338";
const NotLeftTriangle = "\u22EA";
const NotLeftTriangleEqual = "\u22EC";
const NotLess = "\u226E";
const NotLessEqual = "\u2270";
const NotLessGreater = "\u2278";
const NotLessLess = "\u226A\u0338";
const NotLessSlantEqual = "\u2A7D\u0338";
const NotLessTilde = "\u2274";
const NotNestedGreaterGreater = "\u2AA2\u0338";
const NotNestedLessLess = "\u2AA1\u0338";
const notni = "\u220C";
const notniva = "\u220C";
const notnivb = "\u22FE";
const notnivc = "\u22FD";
const NotPrecedes = "\u2280";
const NotPrecedesEqual = "\u2AAF\u0338";
const NotPrecedesSlantEqual = "\u22E0";
const NotReverseElement = "\u220C";
const NotRightTriangleBar = "\u29D0\u0338";
const NotRightTriangle = "\u22EB";
const NotRightTriangleEqual = "\u22ED";
const NotSquareSubset = "\u228F\u0338";
const NotSquareSubsetEqual = "\u22E2";
const NotSquareSuperset = "\u2290\u0338";
const NotSquareSupersetEqual = "\u22E3";
const NotSubset = "\u2282\u20D2";
const NotSubsetEqual = "\u2288";
const NotSucceeds = "\u2281";
const NotSucceedsEqual = "\u2AB0\u0338";
const NotSucceedsSlantEqual = "\u22E1";
const NotSucceedsTilde = "\u227F\u0338";
const NotSuperset = "\u2283\u20D2";
const NotSupersetEqual = "\u2289";
const NotTilde = "\u2241";
const NotTildeEqual = "\u2244";
const NotTildeFullEqual = "\u2247";
const NotTildeTilde = "\u2249";
const NotVerticalBar = "\u2224";
const nparallel = "\u2226";
const npar = "\u2226";
const nparsl = "\u2AFD\u20E5";
const npart = "\u2202\u0338";
const npolint = "\u2A14";
const npr = "\u2280";
const nprcue = "\u22E0";
const nprec = "\u2280";
const npreceq = "\u2AAF\u0338";
const npre = "\u2AAF\u0338";
const nrarrc = "\u2933\u0338";
const nrarr = "\u219B";
const nrArr = "\u21CF";
const nrarrw = "\u219D\u0338";
const nrightarrow = "\u219B";
const nRightarrow = "\u21CF";
const nrtri = "\u22EB";
const nrtrie = "\u22ED";
const nsc = "\u2281";
const nsccue = "\u22E1";
const nsce = "\u2AB0\u0338";
const Nscr = "\u{1D4A9}";
const nscr = "\u{1D4C3}";
const nshortmid = "\u2224";
const nshortparallel = "\u2226";
const nsim = "\u2241";
const nsime = "\u2244";
const nsimeq = "\u2244";
const nsmid = "\u2224";
const nspar = "\u2226";
const nsqsube = "\u22E2";
const nsqsupe = "\u22E3";
const nsub = "\u2284";
const nsubE = "\u2AC5\u0338";
const nsube = "\u2288";
const nsubset = "\u2282\u20D2";
const nsubseteq = "\u2288";
const nsubseteqq = "\u2AC5\u0338";
const nsucc = "\u2281";
const nsucceq = "\u2AB0\u0338";
const nsup = "\u2285";
const nsupE = "\u2AC6\u0338";
const nsupe = "\u2289";
const nsupset = "\u2283\u20D2";
const nsupseteq = "\u2289";
const nsupseteqq = "\u2AC6\u0338";
const ntgl = "\u2279";
const Ntilde$1 = "\xD1";
const ntilde$1 = "\xF1";
const ntlg = "\u2278";
const ntriangleleft = "\u22EA";
const ntrianglelefteq = "\u22EC";
const ntriangleright = "\u22EB";
const ntrianglerighteq = "\u22ED";
const Nu = "\u039D";
const nu = "\u03BD";
const num = "#";
const numero = "\u2116";
const numsp = "\u2007";
const nvap = "\u224D\u20D2";
const nvdash = "\u22AC";
const nvDash = "\u22AD";
const nVdash = "\u22AE";
const nVDash = "\u22AF";
const nvge = "\u2265\u20D2";
const nvgt = ">\u20D2";
const nvHarr = "\u2904";
const nvinfin = "\u29DE";
const nvlArr = "\u2902";
const nvle = "\u2264\u20D2";
const nvlt = "<\u20D2";
const nvltrie = "\u22B4\u20D2";
const nvrArr = "\u2903";
const nvrtrie = "\u22B5\u20D2";
const nvsim = "\u223C\u20D2";
const nwarhk = "\u2923";
const nwarr = "\u2196";
const nwArr = "\u21D6";
const nwarrow = "\u2196";
const nwnear = "\u2927";
const Oacute$1 = "\xD3";
const oacute$1 = "\xF3";
const oast = "\u229B";
const Ocirc$1 = "\xD4";
const ocirc$1 = "\xF4";
const ocir = "\u229A";
const Ocy = "\u041E";
const ocy = "\u043E";
const odash = "\u229D";
const Odblac = "\u0150";
const odblac = "\u0151";
const odiv = "\u2A38";
const odot = "\u2299";
const odsold = "\u29BC";
const OElig = "\u0152";
const oelig = "\u0153";
const ofcir = "\u29BF";
const Ofr = "\u{1D512}";
const ofr = "\u{1D52C}";
const ogon = "\u02DB";
const Ograve$1 = "\xD2";
const ograve$1 = "\xF2";
const ogt = "\u29C1";
const ohbar = "\u29B5";
const ohm = "\u03A9";
const oint = "\u222E";
const olarr = "\u21BA";
const olcir = "\u29BE";
const olcross = "\u29BB";
const oline = "\u203E";
const olt = "\u29C0";
const Omacr = "\u014C";
const omacr = "\u014D";
const Omega = "\u03A9";
const omega = "\u03C9";
const Omicron = "\u039F";
const omicron = "\u03BF";
const omid = "\u29B6";
const ominus = "\u2296";
const Oopf = "\u{1D546}";
const oopf = "\u{1D560}";
const opar = "\u29B7";
const OpenCurlyDoubleQuote = "\u201C";
const OpenCurlyQuote = "\u2018";
const operp = "\u29B9";
const oplus = "\u2295";
const orarr = "\u21BB";
const Or = "\u2A54";
const or = "\u2228";
const ord = "\u2A5D";
const order = "\u2134";
const orderof = "\u2134";
const ordf$1 = "\xAA";
const ordm$1 = "\xBA";
const origof = "\u22B6";
const oror = "\u2A56";
const orslope = "\u2A57";
const orv = "\u2A5B";
const oS = "\u24C8";
const Oscr = "\u{1D4AA}";
const oscr = "\u2134";
const Oslash$1 = "\xD8";
const oslash$1 = "\xF8";
const osol = "\u2298";
const Otilde$1 = "\xD5";
const otilde$1 = "\xF5";
const otimesas = "\u2A36";
const Otimes = "\u2A37";
const otimes = "\u2297";
const Ouml$1 = "\xD6";
const ouml$1 = "\xF6";
const ovbar = "\u233D";
const OverBar = "\u203E";
const OverBrace = "\u23DE";
const OverBracket = "\u23B4";
const OverParenthesis = "\u23DC";
const para$1 = "\xB6";
const parallel = "\u2225";
const par = "\u2225";
const parsim = "\u2AF3";
const parsl = "\u2AFD";
const part = "\u2202";
const PartialD = "\u2202";
const Pcy = "\u041F";
const pcy = "\u043F";
const percnt = "%";
const period = ".";
const permil = "\u2030";
const perp = "\u22A5";
const pertenk = "\u2031";
const Pfr = "\u{1D513}";
const pfr = "\u{1D52D}";
const Phi = "\u03A6";
const phi = "\u03C6";
const phiv = "\u03D5";
const phmmat = "\u2133";
const phone = "\u260E";
const Pi = "\u03A0";
const pi = "\u03C0";
const pitchfork = "\u22D4";
const piv = "\u03D6";
const planck = "\u210F";
const planckh = "\u210E";
const plankv = "\u210F";
const plusacir = "\u2A23";
const plusb = "\u229E";
const pluscir = "\u2A22";
const plus = "+";
const plusdo = "\u2214";
const plusdu = "\u2A25";
const pluse = "\u2A72";
const PlusMinus = "\xB1";
const plusmn$1 = "\xB1";
const plussim = "\u2A26";
const plustwo = "\u2A27";
const pm = "\xB1";
const Poincareplane = "\u210C";
const pointint = "\u2A15";
const popf = "\u{1D561}";
const Popf = "\u2119";
const pound$1 = "\xA3";
const prap = "\u2AB7";
const Pr = "\u2ABB";
const pr = "\u227A";
const prcue = "\u227C";
const precapprox = "\u2AB7";
const prec = "\u227A";
const preccurlyeq = "\u227C";
const Precedes = "\u227A";
const PrecedesEqual = "\u2AAF";
const PrecedesSlantEqual = "\u227C";
const PrecedesTilde = "\u227E";
const preceq = "\u2AAF";
const precnapprox = "\u2AB9";
const precneqq = "\u2AB5";
const precnsim = "\u22E8";
const pre = "\u2AAF";
const prE = "\u2AB3";
const precsim = "\u227E";
const prime = "\u2032";
const Prime = "\u2033";
const primes = "\u2119";
const prnap = "\u2AB9";
const prnE = "\u2AB5";
const prnsim = "\u22E8";
const prod = "\u220F";
const Product = "\u220F";
const profalar = "\u232E";
const profline = "\u2312";
const profsurf = "\u2313";
const prop = "\u221D";
const Proportional = "\u221D";
const Proportion = "\u2237";
const propto = "\u221D";
const prsim = "\u227E";
const prurel = "\u22B0";
const Pscr = "\u{1D4AB}";
const pscr = "\u{1D4C5}";
const Psi = "\u03A8";
const psi = "\u03C8";
const puncsp = "\u2008";
const Qfr = "\u{1D514}";
const qfr = "\u{1D52E}";
const qint = "\u2A0C";
const qopf = "\u{1D562}";
const Qopf = "\u211A";
const qprime = "\u2057";
const Qscr = "\u{1D4AC}";
const qscr = "\u{1D4C6}";
const quaternions = "\u210D";
const quatint = "\u2A16";
const quest = "?";
const questeq = "\u225F";
const quot$2 = '"';
const QUOT$1 = '"';
const rAarr = "\u21DB";
const race = "\u223D\u0331";
const Racute = "\u0154";
const racute = "\u0155";
const radic = "\u221A";
const raemptyv = "\u29B3";
const rang = "\u27E9";
const Rang = "\u27EB";
const rangd = "\u2992";
const range = "\u29A5";
const rangle = "\u27E9";
const raquo$1 = "\xBB";
const rarrap = "\u2975";
const rarrb = "\u21E5";
const rarrbfs = "\u2920";
const rarrc = "\u2933";
const rarr = "\u2192";
const Rarr = "\u21A0";
const rArr = "\u21D2";
const rarrfs = "\u291E";
const rarrhk = "\u21AA";
const rarrlp = "\u21AC";
const rarrpl = "\u2945";
const rarrsim = "\u2974";
const Rarrtl = "\u2916";
const rarrtl = "\u21A3";
const rarrw = "\u219D";
const ratail = "\u291A";
const rAtail = "\u291C";
const ratio = "\u2236";
const rationals = "\u211A";
const rbarr = "\u290D";
const rBarr = "\u290F";
const RBarr = "\u2910";
const rbbrk = "\u2773";
const rbrace = "}";
const rbrack = "]";
const rbrke = "\u298C";
const rbrksld = "\u298E";
const rbrkslu = "\u2990";
const Rcaron = "\u0158";
const rcaron = "\u0159";
const Rcedil = "\u0156";
const rcedil = "\u0157";
const rceil = "\u2309";
const rcub = "}";
const Rcy = "\u0420";
const rcy = "\u0440";
const rdca = "\u2937";
const rdldhar = "\u2969";
const rdquo = "\u201D";
const rdquor = "\u201D";
const rdsh = "\u21B3";
const real = "\u211C";
const realine = "\u211B";
const realpart = "\u211C";
const reals = "\u211D";
const Re = "\u211C";
const rect = "\u25AD";
const reg$1 = "\xAE";
const REG$1 = "\xAE";
const ReverseElement = "\u220B";
const ReverseEquilibrium = "\u21CB";
const ReverseUpEquilibrium = "\u296F";
const rfisht = "\u297D";
const rfloor = "\u230B";
const rfr = "\u{1D52F}";
const Rfr = "\u211C";
const rHar = "\u2964";
const rhard = "\u21C1";
const rharu = "\u21C0";
const rharul = "\u296C";
const Rho = "\u03A1";
const rho = "\u03C1";
const rhov = "\u03F1";
const RightAngleBracket = "\u27E9";
const RightArrowBar = "\u21E5";
const rightarrow = "\u2192";
const RightArrow = "\u2192";
const Rightarrow = "\u21D2";
const RightArrowLeftArrow = "\u21C4";
const rightarrowtail = "\u21A3";
const RightCeiling = "\u2309";
const RightDoubleBracket = "\u27E7";
const RightDownTeeVector = "\u295D";
const RightDownVectorBar = "\u2955";
const RightDownVector = "\u21C2";
const RightFloor = "\u230B";
const rightharpoondown = "\u21C1";
const rightharpoonup = "\u21C0";
const rightleftarrows = "\u21C4";
const rightleftharpoons = "\u21CC";
const rightrightarrows = "\u21C9";
const rightsquigarrow = "\u219D";
const RightTeeArrow = "\u21A6";
const RightTee = "\u22A2";
const RightTeeVector = "\u295B";
const rightthreetimes = "\u22CC";
const RightTriangleBar = "\u29D0";
const RightTriangle = "\u22B3";
const RightTriangleEqual = "\u22B5";
const RightUpDownVector = "\u294F";
const RightUpTeeVector = "\u295C";
const RightUpVectorBar = "\u2954";
const RightUpVector = "\u21BE";
const RightVectorBar = "\u2953";
const RightVector = "\u21C0";
const ring = "\u02DA";
const risingdotseq = "\u2253";
const rlarr = "\u21C4";
const rlhar = "\u21CC";
const rlm = "\u200F";
const rmoustache = "\u23B1";
const rmoust = "\u23B1";
const rnmid = "\u2AEE";
const roang = "\u27ED";
const roarr = "\u21FE";
const robrk = "\u27E7";
const ropar = "\u2986";
const ropf = "\u{1D563}";
const Ropf = "\u211D";
const roplus = "\u2A2E";
const rotimes = "\u2A35";
const RoundImplies = "\u2970";
const rpar = ")";
const rpargt = "\u2994";
const rppolint = "\u2A12";
const rrarr = "\u21C9";
const Rrightarrow = "\u21DB";
const rsaquo = "\u203A";
const rscr = "\u{1D4C7}";
const Rscr = "\u211B";
const rsh = "\u21B1";
const Rsh = "\u21B1";
const rsqb = "]";
const rsquo = "\u2019";
const rsquor = "\u2019";
const rthree = "\u22CC";
const rtimes = "\u22CA";
const rtri = "\u25B9";
const rtrie = "\u22B5";
const rtrif = "\u25B8";
const rtriltri = "\u29CE";
const RuleDelayed = "\u29F4";
const ruluhar = "\u2968";
const rx = "\u211E";
const Sacute = "\u015A";
const sacute = "\u015B";
const sbquo = "\u201A";
const scap = "\u2AB8";
const Scaron = "\u0160";
const scaron = "\u0161";
const Sc = "\u2ABC";
const sc = "\u227B";
const sccue = "\u227D";
const sce = "\u2AB0";
const scE = "\u2AB4";
const Scedil = "\u015E";
const scedil = "\u015F";
const Scirc = "\u015C";
const scirc = "\u015D";
const scnap = "\u2ABA";
const scnE = "\u2AB6";
const scnsim = "\u22E9";
const scpolint = "\u2A13";
const scsim = "\u227F";
const Scy = "\u0421";
const scy = "\u0441";
const sdotb = "\u22A1";
const sdot = "\u22C5";
const sdote = "\u2A66";
const searhk = "\u2925";
const searr = "\u2198";
const seArr = "\u21D8";
const searrow = "\u2198";
const sect$1 = "\xA7";
const semi = ";";
const seswar = "\u2929";
const setminus = "\u2216";
const setmn = "\u2216";
const sext = "\u2736";
const Sfr = "\u{1D516}";
const sfr = "\u{1D530}";
const sfrown = "\u2322";
const sharp = "\u266F";
const SHCHcy = "\u0429";
const shchcy = "\u0449";
const SHcy = "\u0428";
const shcy = "\u0448";
const ShortDownArrow = "\u2193";
const ShortLeftArrow = "\u2190";
const shortmid = "\u2223";
const shortparallel = "\u2225";
const ShortRightArrow = "\u2192";
const ShortUpArrow = "\u2191";
const shy$1 = "\xAD";
const Sigma = "\u03A3";
const sigma = "\u03C3";
const sigmaf = "\u03C2";
const sigmav = "\u03C2";
const sim = "\u223C";
const simdot = "\u2A6A";
const sime = "\u2243";
const simeq = "\u2243";
const simg = "\u2A9E";
const simgE = "\u2AA0";
const siml = "\u2A9D";
const simlE = "\u2A9F";
const simne = "\u2246";
const simplus = "\u2A24";
const simrarr = "\u2972";
const slarr = "\u2190";
const SmallCircle = "\u2218";
const smallsetminus = "\u2216";
const smashp = "\u2A33";
const smeparsl = "\u29E4";
const smid = "\u2223";
const smile = "\u2323";
const smt = "\u2AAA";
const smte = "\u2AAC";
const smtes = "\u2AAC\uFE00";
const SOFTcy = "\u042C";
const softcy = "\u044C";
const solbar = "\u233F";
const solb = "\u29C4";
const sol = "/";
const Sopf = "\u{1D54A}";
const sopf = "\u{1D564}";
const spades = "\u2660";
const spadesuit = "\u2660";
const spar = "\u2225";
const sqcap = "\u2293";
const sqcaps = "\u2293\uFE00";
const sqcup = "\u2294";
const sqcups = "\u2294\uFE00";
const Sqrt = "\u221A";
const sqsub = "\u228F";
const sqsube = "\u2291";
const sqsubset = "\u228F";
const sqsubseteq = "\u2291";
const sqsup = "\u2290";
const sqsupe = "\u2292";
const sqsupset = "\u2290";
const sqsupseteq = "\u2292";
const square = "\u25A1";
const Square = "\u25A1";
const SquareIntersection = "\u2293";
const SquareSubset = "\u228F";
const SquareSubsetEqual = "\u2291";
const SquareSuperset = "\u2290";
const SquareSupersetEqual = "\u2292";
const SquareUnion = "\u2294";
const squarf = "\u25AA";
const squ = "\u25A1";
const squf = "\u25AA";
const srarr = "\u2192";
const Sscr = "\u{1D4AE}";
const sscr = "\u{1D4C8}";
const ssetmn = "\u2216";
const ssmile = "\u2323";
const sstarf = "\u22C6";
const Star = "\u22C6";
const star = "\u2606";
const starf = "\u2605";
const straightepsilon = "\u03F5";
const straightphi = "\u03D5";
const strns = "\xAF";
const sub = "\u2282";
const Sub = "\u22D0";
const subdot = "\u2ABD";
const subE = "\u2AC5";
const sube = "\u2286";
const subedot = "\u2AC3";
const submult = "\u2AC1";
const subnE = "\u2ACB";
const subne = "\u228A";
const subplus = "\u2ABF";
const subrarr = "\u2979";
const subset = "\u2282";
const Subset = "\u22D0";
const subseteq = "\u2286";
const subseteqq = "\u2AC5";
const SubsetEqual = "\u2286";
const subsetneq = "\u228A";
const subsetneqq = "\u2ACB";
const subsim = "\u2AC7";
const subsub = "\u2AD5";
const subsup = "\u2AD3";
const succapprox = "\u2AB8";
const succ = "\u227B";
const succcurlyeq = "\u227D";
const Succeeds = "\u227B";
const SucceedsEqual = "\u2AB0";
const SucceedsSlantEqual = "\u227D";
const SucceedsTilde = "\u227F";
const succeq = "\u2AB0";
const succnapprox = "\u2ABA";
const succneqq = "\u2AB6";
const succnsim = "\u22E9";
const succsim = "\u227F";
const SuchThat = "\u220B";
const sum = "\u2211";
const Sum = "\u2211";
const sung = "\u266A";
const sup1$1 = "\xB9";
const sup2$1 = "\xB2";
const sup3$1 = "\xB3";
const sup = "\u2283";
const Sup = "\u22D1";
const supdot = "\u2ABE";
const supdsub = "\u2AD8";
const supE = "\u2AC6";
const supe = "\u2287";
const supedot = "\u2AC4";
const Superset = "\u2283";
const SupersetEqual = "\u2287";
const suphsol = "\u27C9";
const suphsub = "\u2AD7";
const suplarr = "\u297B";
const supmult = "\u2AC2";
const supnE = "\u2ACC";
const supne = "\u228B";
const supplus = "\u2AC0";
const supset = "\u2283";
const Supset = "\u22D1";
const supseteq = "\u2287";
const supseteqq = "\u2AC6";
const supsetneq = "\u228B";
const supsetneqq = "\u2ACC";
const supsim = "\u2AC8";
const supsub = "\u2AD4";
const supsup = "\u2AD6";
const swarhk = "\u2926";
const swarr = "\u2199";
const swArr = "\u21D9";
const swarrow = "\u2199";
const swnwar = "\u292A";
const szlig$1 = "\xDF";
const Tab = "	";
const target = "\u2316";
const Tau = "\u03A4";
const tau = "\u03C4";
const tbrk = "\u23B4";
const Tcaron = "\u0164";
const tcaron = "\u0165";
const Tcedil = "\u0162";
const tcedil = "\u0163";
const Tcy = "\u0422";
const tcy = "\u0442";
const tdot = "\u20DB";
const telrec = "\u2315";
const Tfr = "\u{1D517}";
const tfr = "\u{1D531}";
const there4 = "\u2234";
const therefore = "\u2234";
const Therefore = "\u2234";
const Theta = "\u0398";
const theta = "\u03B8";
const thetasym = "\u03D1";
const thetav = "\u03D1";
const thickapprox = "\u2248";
const thicksim = "\u223C";
const ThickSpace = "\u205F\u200A";
const ThinSpace = "\u2009";
const thinsp = "\u2009";
const thkap = "\u2248";
const thksim = "\u223C";
const THORN$1 = "\xDE";
const thorn$1 = "\xFE";
const tilde = "\u02DC";
const Tilde = "\u223C";
const TildeEqual = "\u2243";
const TildeFullEqual = "\u2245";
const TildeTilde = "\u2248";
const timesbar = "\u2A31";
const timesb = "\u22A0";
const times$1 = "\xD7";
const timesd = "\u2A30";
const tint = "\u222D";
const toea = "\u2928";
const topbot = "\u2336";
const topcir = "\u2AF1";
const top = "\u22A4";
const Topf = "\u{1D54B}";
const topf = "\u{1D565}";
const topfork = "\u2ADA";
const tosa = "\u2929";
const tprime = "\u2034";
const trade = "\u2122";
const TRADE = "\u2122";
const triangle = "\u25B5";
const triangledown = "\u25BF";
const triangleleft = "\u25C3";
const trianglelefteq = "\u22B4";
const triangleq = "\u225C";
const triangleright = "\u25B9";
const trianglerighteq = "\u22B5";
const tridot = "\u25EC";
const trie = "\u225C";
const triminus = "\u2A3A";
const TripleDot = "\u20DB";
const triplus = "\u2A39";
const trisb = "\u29CD";
const tritime = "\u2A3B";
const trpezium = "\u23E2";
const Tscr = "\u{1D4AF}";
const tscr = "\u{1D4C9}";
const TScy = "\u0426";
const tscy = "\u0446";
const TSHcy = "\u040B";
const tshcy = "\u045B";
const Tstrok = "\u0166";
const tstrok = "\u0167";
const twixt = "\u226C";
const twoheadleftarrow = "\u219E";
const twoheadrightarrow = "\u21A0";
const Uacute$1 = "\xDA";
const uacute$1 = "\xFA";
const uarr = "\u2191";
const Uarr = "\u219F";
const uArr = "\u21D1";
const Uarrocir = "\u2949";
const Ubrcy = "\u040E";
const ubrcy = "\u045E";
const Ubreve = "\u016C";
const ubreve = "\u016D";
const Ucirc$1 = "\xDB";
const ucirc$1 = "\xFB";
const Ucy = "\u0423";
const ucy = "\u0443";
const udarr = "\u21C5";
const Udblac = "\u0170";
const udblac = "\u0171";
const udhar = "\u296E";
const ufisht = "\u297E";
const Ufr = "\u{1D518}";
const ufr = "\u{1D532}";
const Ugrave$1 = "\xD9";
const ugrave$1 = "\xF9";
const uHar = "\u2963";
const uharl = "\u21BF";
const uharr = "\u21BE";
const uhblk = "\u2580";
const ulcorn = "\u231C";
const ulcorner = "\u231C";
const ulcrop = "\u230F";
const ultri = "\u25F8";
const Umacr = "\u016A";
const umacr = "\u016B";
const uml$1 = "\xA8";
const UnderBar = "_";
const UnderBrace = "\u23DF";
const UnderBracket = "\u23B5";
const UnderParenthesis = "\u23DD";
const Union = "\u22C3";
const UnionPlus = "\u228E";
const Uogon = "\u0172";
const uogon = "\u0173";
const Uopf = "\u{1D54C}";
const uopf = "\u{1D566}";
const UpArrowBar = "\u2912";
const uparrow = "\u2191";
const UpArrow = "\u2191";
const Uparrow = "\u21D1";
const UpArrowDownArrow = "\u21C5";
const updownarrow = "\u2195";
const UpDownArrow = "\u2195";
const Updownarrow = "\u21D5";
const UpEquilibrium = "\u296E";
const upharpoonleft = "\u21BF";
const upharpoonright = "\u21BE";
const uplus = "\u228E";
const UpperLeftArrow = "\u2196";
const UpperRightArrow = "\u2197";
const upsi = "\u03C5";
const Upsi = "\u03D2";
const upsih = "\u03D2";
const Upsilon = "\u03A5";
const upsilon = "\u03C5";
const UpTeeArrow = "\u21A5";
const UpTee = "\u22A5";
const upuparrows = "\u21C8";
const urcorn = "\u231D";
const urcorner = "\u231D";
const urcrop = "\u230E";
const Uring = "\u016E";
const uring = "\u016F";
const urtri = "\u25F9";
const Uscr = "\u{1D4B0}";
const uscr = "\u{1D4CA}";
const utdot = "\u22F0";
const Utilde = "\u0168";
const utilde = "\u0169";
const utri = "\u25B5";
const utrif = "\u25B4";
const uuarr = "\u21C8";
const Uuml$1 = "\xDC";
const uuml$1 = "\xFC";
const uwangle = "\u29A7";
const vangrt = "\u299C";
const varepsilon = "\u03F5";
const varkappa = "\u03F0";
const varnothing = "\u2205";
const varphi = "\u03D5";
const varpi = "\u03D6";
const varpropto = "\u221D";
const varr = "\u2195";
const vArr = "\u21D5";
const varrho = "\u03F1";
const varsigma = "\u03C2";
const varsubsetneq = "\u228A\uFE00";
const varsubsetneqq = "\u2ACB\uFE00";
const varsupsetneq = "\u228B\uFE00";
const varsupsetneqq = "\u2ACC\uFE00";
const vartheta = "\u03D1";
const vartriangleleft = "\u22B2";
const vartriangleright = "\u22B3";
const vBar = "\u2AE8";
const Vbar = "\u2AEB";
const vBarv = "\u2AE9";
const Vcy = "\u0412";
const vcy = "\u0432";
const vdash = "\u22A2";
const vDash = "\u22A8";
const Vdash = "\u22A9";
const VDash = "\u22AB";
const Vdashl = "\u2AE6";
const veebar = "\u22BB";
const vee = "\u2228";
const Vee = "\u22C1";
const veeeq = "\u225A";
const vellip = "\u22EE";
const verbar = "|";
const Verbar = "\u2016";
const vert = "|";
const Vert = "\u2016";
const VerticalBar = "\u2223";
const VerticalLine = "|";
const VerticalSeparator = "\u2758";
const VerticalTilde = "\u2240";
const VeryThinSpace = "\u200A";
const Vfr = "\u{1D519}";
const vfr = "\u{1D533}";
const vltri = "\u22B2";
const vnsub = "\u2282\u20D2";
const vnsup = "\u2283\u20D2";
const Vopf = "\u{1D54D}";
const vopf = "\u{1D567}";
const vprop = "\u221D";
const vrtri = "\u22B3";
const Vscr = "\u{1D4B1}";
const vscr = "\u{1D4CB}";
const vsubnE = "\u2ACB\uFE00";
const vsubne = "\u228A\uFE00";
const vsupnE = "\u2ACC\uFE00";
const vsupne = "\u228B\uFE00";
const Vvdash = "\u22AA";
const vzigzag = "\u299A";
const Wcirc = "\u0174";
const wcirc = "\u0175";
const wedbar = "\u2A5F";
const wedge = "\u2227";
const Wedge = "\u22C0";
const wedgeq = "\u2259";
const weierp = "\u2118";
const Wfr = "\u{1D51A}";
const wfr = "\u{1D534}";
const Wopf = "\u{1D54E}";
const wopf = "\u{1D568}";
const wp = "\u2118";
const wr = "\u2240";
const wreath = "\u2240";
const Wscr = "\u{1D4B2}";
const wscr = "\u{1D4CC}";
const xcap = "\u22C2";
const xcirc = "\u25EF";
const xcup = "\u22C3";
const xdtri = "\u25BD";
const Xfr = "\u{1D51B}";
const xfr = "\u{1D535}";
const xharr = "\u27F7";
const xhArr = "\u27FA";
const Xi = "\u039E";
const xi = "\u03BE";
const xlarr = "\u27F5";
const xlArr = "\u27F8";
const xmap = "\u27FC";
const xnis = "\u22FB";
const xodot = "\u2A00";
const Xopf = "\u{1D54F}";
const xopf = "\u{1D569}";
const xoplus = "\u2A01";
const xotime = "\u2A02";
const xrarr = "\u27F6";
const xrArr = "\u27F9";
const Xscr = "\u{1D4B3}";
const xscr = "\u{1D4CD}";
const xsqcup = "\u2A06";
const xuplus = "\u2A04";
const xutri = "\u25B3";
const xvee = "\u22C1";
const xwedge = "\u22C0";
const Yacute$1 = "\xDD";
const yacute$1 = "\xFD";
const YAcy = "\u042F";
const yacy = "\u044F";
const Ycirc = "\u0176";
const ycirc = "\u0177";
const Ycy = "\u042B";
const ycy = "\u044B";
const yen$1 = "\xA5";
const Yfr = "\u{1D51C}";
const yfr = "\u{1D536}";
const YIcy = "\u0407";
const yicy = "\u0457";
const Yopf = "\u{1D550}";
const yopf = "\u{1D56A}";
const Yscr = "\u{1D4B4}";
const yscr = "\u{1D4CE}";
const YUcy = "\u042E";
const yucy = "\u044E";
const yuml$1 = "\xFF";
const Yuml = "\u0178";
const Zacute = "\u0179";
const zacute = "\u017A";
const Zcaron = "\u017D";
const zcaron = "\u017E";
const Zcy = "\u0417";
const zcy = "\u0437";
const Zdot = "\u017B";
const zdot = "\u017C";
const zeetrf = "\u2128";
const ZeroWidthSpace = "\u200B";
const Zeta = "\u0396";
const zeta = "\u03B6";
const zfr = "\u{1D537}";
const Zfr = "\u2128";
const ZHcy = "\u0416";
const zhcy = "\u0436";
const zigrarr = "\u21DD";
const zopf = "\u{1D56B}";
const Zopf = "\u2124";
const Zscr = "\u{1D4B5}";
const zscr = "\u{1D4CF}";
const zwj = "\u200D";
const zwnj = "\u200C";
const require$$1$1 = {
  Aacute: Aacute$1,
  aacute: aacute$1,
  Abreve,
  abreve,
  ac,
  acd,
  acE,
  Acirc: Acirc$1,
  acirc: acirc$1,
  acute: acute$1,
  Acy,
  acy,
  AElig: AElig$1,
  aelig: aelig$1,
  af,
  Afr,
  afr,
  Agrave: Agrave$1,
  agrave: agrave$1,
  alefsym,
  aleph,
  Alpha,
  alpha,
  Amacr,
  amacr,
  amalg,
  amp: amp$2,
  AMP: AMP$1,
  andand,
  And,
  and,
  andd,
  andslope,
  andv,
  ang,
  ange,
  angle,
  angmsdaa,
  angmsdab,
  angmsdac,
  angmsdad,
  angmsdae,
  angmsdaf,
  angmsdag,
  angmsdah,
  angmsd,
  angrt,
  angrtvb,
  angrtvbd,
  angsph,
  angst,
  angzarr,
  Aogon,
  aogon,
  Aopf,
  aopf,
  apacir,
  ap,
  apE,
  ape,
  apid,
  apos: apos$1,
  ApplyFunction,
  approx,
  approxeq,
  Aring: Aring$1,
  aring: aring$1,
  Ascr,
  ascr,
  Assign,
  ast,
  asymp,
  asympeq,
  Atilde: Atilde$1,
  atilde: atilde$1,
  Auml: Auml$1,
  auml: auml$1,
  awconint,
  awint,
  backcong,
  backepsilon,
  backprime,
  backsim,
  backsimeq,
  Backslash,
  Barv,
  barvee,
  barwed,
  Barwed,
  barwedge,
  bbrk,
  bbrktbrk,
  bcong,
  Bcy,
  bcy,
  bdquo,
  becaus,
  because,
  Because,
  bemptyv,
  bepsi,
  bernou,
  Bernoullis,
  Beta,
  beta,
  beth,
  between,
  Bfr,
  bfr,
  bigcap,
  bigcirc,
  bigcup,
  bigodot,
  bigoplus,
  bigotimes,
  bigsqcup,
  bigstar,
  bigtriangledown,
  bigtriangleup,
  biguplus,
  bigvee,
  bigwedge,
  bkarow,
  blacklozenge,
  blacksquare,
  blacktriangle,
  blacktriangledown,
  blacktriangleleft,
  blacktriangleright,
  blank,
  blk12,
  blk14,
  blk34,
  block,
  bne,
  bnequiv,
  bNot,
  bnot,
  Bopf,
  bopf,
  bot,
  bottom,
  bowtie,
  boxbox,
  boxdl,
  boxdL,
  boxDl,
  boxDL,
  boxdr,
  boxdR,
  boxDr,
  boxDR,
  boxh,
  boxH,
  boxhd,
  boxHd,
  boxhD,
  boxHD,
  boxhu,
  boxHu,
  boxhU,
  boxHU,
  boxminus,
  boxplus,
  boxtimes,
  boxul,
  boxuL,
  boxUl,
  boxUL,
  boxur,
  boxuR,
  boxUr,
  boxUR,
  boxv,
  boxV,
  boxvh,
  boxvH,
  boxVh,
  boxVH,
  boxvl,
  boxvL,
  boxVl,
  boxVL,
  boxvr,
  boxvR,
  boxVr,
  boxVR,
  bprime,
  breve,
  Breve,
  brvbar: brvbar$1,
  bscr,
  Bscr,
  bsemi,
  bsim,
  bsime,
  bsolb,
  bsol,
  bsolhsub,
  bull,
  bullet,
  bump,
  bumpE,
  bumpe,
  Bumpeq,
  bumpeq,
  Cacute,
  cacute,
  capand,
  capbrcup,
  capcap,
  cap,
  Cap,
  capcup,
  capdot,
  CapitalDifferentialD,
  caps,
  caret,
  caron,
  Cayleys,
  ccaps,
  Ccaron,
  ccaron,
  Ccedil: Ccedil$1,
  ccedil: ccedil$1,
  Ccirc,
  ccirc,
  Cconint,
  ccups,
  ccupssm,
  Cdot,
  cdot,
  cedil: cedil$1,
  Cedilla,
  cemptyv,
  cent: cent$1,
  centerdot,
  CenterDot,
  cfr,
  Cfr,
  CHcy,
  chcy,
  check,
  checkmark,
  Chi,
  chi,
  circ,
  circeq,
  circlearrowleft,
  circlearrowright,
  circledast,
  circledcirc,
  circleddash,
  CircleDot,
  circledR,
  circledS,
  CircleMinus,
  CirclePlus,
  CircleTimes,
  cir,
  cirE,
  cire,
  cirfnint,
  cirmid,
  cirscir,
  ClockwiseContourIntegral,
  CloseCurlyDoubleQuote,
  CloseCurlyQuote,
  clubs,
  clubsuit,
  colon,
  Colon,
  Colone,
  colone,
  coloneq,
  comma,
  commat,
  comp,
  compfn,
  complement,
  complexes,
  cong,
  congdot,
  Congruent,
  conint,
  Conint,
  ContourIntegral,
  copf,
  Copf,
  coprod,
  Coproduct,
  copy: copy$1,
  COPY: COPY$1,
  copysr,
  CounterClockwiseContourIntegral,
  crarr,
  cross,
  Cross,
  Cscr,
  cscr,
  csub,
  csube,
  csup,
  csupe,
  ctdot,
  cudarrl,
  cudarrr,
  cuepr,
  cuesc,
  cularr,
  cularrp,
  cupbrcap,
  cupcap,
  CupCap,
  cup,
  Cup,
  cupcup,
  cupdot,
  cupor,
  cups,
  curarr,
  curarrm,
  curlyeqprec,
  curlyeqsucc,
  curlyvee,
  curlywedge,
  curren: curren$1,
  curvearrowleft,
  curvearrowright,
  cuvee,
  cuwed,
  cwconint,
  cwint,
  cylcty,
  dagger,
  Dagger,
  daleth,
  darr,
  Darr,
  dArr,
  dash,
  Dashv,
  dashv,
  dbkarow,
  dblac,
  Dcaron,
  dcaron,
  Dcy,
  dcy,
  ddagger,
  ddarr,
  DD,
  dd,
  DDotrahd,
  ddotseq,
  deg: deg$1,
  Del,
  Delta,
  delta,
  demptyv,
  dfisht,
  Dfr,
  dfr,
  dHar,
  dharl,
  dharr,
  DiacriticalAcute,
  DiacriticalDot,
  DiacriticalDoubleAcute,
  DiacriticalGrave,
  DiacriticalTilde,
  diam,
  diamond,
  Diamond,
  diamondsuit,
  diams,
  die,
  DifferentialD,
  digamma,
  disin,
  div,
  divide: divide$1,
  divideontimes,
  divonx,
  DJcy,
  djcy,
  dlcorn,
  dlcrop,
  dollar,
  Dopf,
  dopf,
  Dot,
  dot,
  DotDot,
  doteq,
  doteqdot,
  DotEqual,
  dotminus,
  dotplus,
  dotsquare,
  doublebarwedge,
  DoubleContourIntegral,
  DoubleDot,
  DoubleDownArrow,
  DoubleLeftArrow,
  DoubleLeftRightArrow,
  DoubleLeftTee,
  DoubleLongLeftArrow,
  DoubleLongLeftRightArrow,
  DoubleLongRightArrow,
  DoubleRightArrow,
  DoubleRightTee,
  DoubleUpArrow,
  DoubleUpDownArrow,
  DoubleVerticalBar,
  DownArrowBar,
  downarrow,
  DownArrow,
  Downarrow,
  DownArrowUpArrow,
  DownBreve,
  downdownarrows,
  downharpoonleft,
  downharpoonright,
  DownLeftRightVector,
  DownLeftTeeVector,
  DownLeftVectorBar,
  DownLeftVector,
  DownRightTeeVector,
  DownRightVectorBar,
  DownRightVector,
  DownTeeArrow,
  DownTee,
  drbkarow,
  drcorn,
  drcrop,
  Dscr,
  dscr,
  DScy,
  dscy,
  dsol,
  Dstrok,
  dstrok,
  dtdot,
  dtri,
  dtrif,
  duarr,
  duhar,
  dwangle,
  DZcy,
  dzcy,
  dzigrarr,
  Eacute: Eacute$1,
  eacute: eacute$1,
  easter,
  Ecaron,
  ecaron,
  Ecirc: Ecirc$1,
  ecirc: ecirc$1,
  ecir,
  ecolon,
  Ecy,
  ecy,
  eDDot,
  Edot,
  edot,
  eDot,
  ee,
  efDot,
  Efr,
  efr,
  eg,
  Egrave: Egrave$1,
  egrave: egrave$1,
  egs,
  egsdot,
  el,
  Element,
  elinters,
  ell,
  els,
  elsdot,
  Emacr,
  emacr,
  empty,
  emptyset,
  EmptySmallSquare,
  emptyv,
  EmptyVerySmallSquare,
  emsp13,
  emsp14,
  emsp,
  ENG,
  eng,
  ensp,
  Eogon,
  eogon,
  Eopf,
  eopf,
  epar,
  eparsl,
  eplus,
  epsi,
  Epsilon,
  epsilon,
  epsiv,
  eqcirc,
  eqcolon,
  eqsim,
  eqslantgtr,
  eqslantless,
  Equal,
  equals,
  EqualTilde,
  equest,
  Equilibrium,
  equiv,
  equivDD,
  eqvparsl,
  erarr,
  erDot,
  escr,
  Escr,
  esdot,
  Esim,
  esim,
  Eta,
  eta,
  ETH: ETH$1,
  eth: eth$1,
  Euml: Euml$1,
  euml: euml$1,
  euro,
  excl,
  exist,
  Exists,
  expectation,
  exponentiale,
  ExponentialE,
  fallingdotseq,
  Fcy,
  fcy,
  female,
  ffilig,
  fflig,
  ffllig,
  Ffr,
  ffr,
  filig,
  FilledSmallSquare,
  FilledVerySmallSquare,
  fjlig,
  flat,
  fllig,
  fltns,
  fnof,
  Fopf,
  fopf,
  forall,
  ForAll,
  fork,
  forkv,
  Fouriertrf,
  fpartint,
  frac12: frac12$1,
  frac13,
  frac14: frac14$1,
  frac15,
  frac16,
  frac18,
  frac23,
  frac25,
  frac34: frac34$1,
  frac35,
  frac38,
  frac45,
  frac56,
  frac58,
  frac78,
  frasl,
  frown,
  fscr,
  Fscr,
  gacute,
  Gamma,
  gamma,
  Gammad,
  gammad,
  gap,
  Gbreve,
  gbreve,
  Gcedil,
  Gcirc,
  gcirc,
  Gcy,
  gcy,
  Gdot,
  gdot,
  ge,
  gE,
  gEl,
  gel,
  geq,
  geqq,
  geqslant,
  gescc,
  ges,
  gesdot,
  gesdoto,
  gesdotol,
  gesl,
  gesles,
  Gfr,
  gfr,
  gg,
  Gg,
  ggg,
  gimel,
  GJcy,
  gjcy,
  gla,
  gl,
  glE,
  glj,
  gnap,
  gnapprox,
  gne,
  gnE,
  gneq,
  gneqq,
  gnsim,
  Gopf,
  gopf,
  grave,
  GreaterEqual,
  GreaterEqualLess,
  GreaterFullEqual,
  GreaterGreater,
  GreaterLess,
  GreaterSlantEqual,
  GreaterTilde,
  Gscr,
  gscr,
  gsim,
  gsime,
  gsiml,
  gtcc,
  gtcir,
  gt: gt$2,
  GT: GT$1,
  Gt,
  gtdot,
  gtlPar,
  gtquest,
  gtrapprox,
  gtrarr,
  gtrdot,
  gtreqless,
  gtreqqless,
  gtrless,
  gtrsim,
  gvertneqq,
  gvnE,
  Hacek,
  hairsp,
  half,
  hamilt,
  HARDcy,
  hardcy,
  harrcir,
  harr,
  hArr,
  harrw,
  Hat,
  hbar,
  Hcirc,
  hcirc,
  hearts,
  heartsuit,
  hellip,
  hercon,
  hfr,
  Hfr,
  HilbertSpace,
  hksearow,
  hkswarow,
  hoarr,
  homtht,
  hookleftarrow,
  hookrightarrow,
  hopf,
  Hopf,
  horbar,
  HorizontalLine,
  hscr,
  Hscr,
  hslash,
  Hstrok,
  hstrok,
  HumpDownHump,
  HumpEqual,
  hybull,
  hyphen,
  Iacute: Iacute$1,
  iacute: iacute$1,
  ic,
  Icirc: Icirc$1,
  icirc: icirc$1,
  Icy,
  icy,
  Idot,
  IEcy,
  iecy,
  iexcl: iexcl$1,
  iff,
  ifr,
  Ifr,
  Igrave: Igrave$1,
  igrave: igrave$1,
  ii,
  iiiint,
  iiint,
  iinfin,
  iiota,
  IJlig,
  ijlig,
  Imacr,
  imacr,
  image,
  ImaginaryI,
  imagline,
  imagpart,
  imath,
  Im,
  imof,
  imped,
  Implies,
  incare,
  "in": "\u2208",
  infin,
  infintie,
  inodot,
  intcal,
  int,
  Int,
  integers,
  Integral,
  intercal,
  Intersection,
  intlarhk,
  intprod,
  InvisibleComma,
  InvisibleTimes,
  IOcy,
  iocy,
  Iogon,
  iogon,
  Iopf,
  iopf,
  Iota,
  iota,
  iprod,
  iquest: iquest$1,
  iscr,
  Iscr,
  isin,
  isindot,
  isinE,
  isins,
  isinsv,
  isinv,
  it,
  Itilde,
  itilde,
  Iukcy,
  iukcy,
  Iuml: Iuml$1,
  iuml: iuml$1,
  Jcirc,
  jcirc,
  Jcy,
  jcy,
  Jfr,
  jfr,
  jmath,
  Jopf,
  jopf,
  Jscr,
  jscr,
  Jsercy,
  jsercy,
  Jukcy,
  jukcy,
  Kappa,
  kappa,
  kappav,
  Kcedil,
  kcedil,
  Kcy,
  kcy,
  Kfr,
  kfr,
  kgreen,
  KHcy,
  khcy,
  KJcy,
  kjcy,
  Kopf,
  kopf,
  Kscr,
  kscr,
  lAarr,
  Lacute,
  lacute,
  laemptyv,
  lagran,
  Lambda,
  lambda,
  lang,
  Lang,
  langd,
  langle,
  lap,
  Laplacetrf,
  laquo: laquo$1,
  larrb,
  larrbfs,
  larr,
  Larr,
  lArr,
  larrfs,
  larrhk,
  larrlp,
  larrpl,
  larrsim,
  larrtl,
  latail,
  lAtail,
  lat,
  late,
  lates,
  lbarr,
  lBarr,
  lbbrk,
  lbrace,
  lbrack,
  lbrke,
  lbrksld,
  lbrkslu,
  Lcaron,
  lcaron,
  Lcedil,
  lcedil,
  lceil,
  lcub,
  Lcy,
  lcy,
  ldca,
  ldquo,
  ldquor,
  ldrdhar,
  ldrushar,
  ldsh,
  le,
  lE,
  LeftAngleBracket,
  LeftArrowBar,
  leftarrow,
  LeftArrow,
  Leftarrow,
  LeftArrowRightArrow,
  leftarrowtail,
  LeftCeiling,
  LeftDoubleBracket,
  LeftDownTeeVector,
  LeftDownVectorBar,
  LeftDownVector,
  LeftFloor,
  leftharpoondown,
  leftharpoonup,
  leftleftarrows,
  leftrightarrow,
  LeftRightArrow,
  Leftrightarrow,
  leftrightarrows,
  leftrightharpoons,
  leftrightsquigarrow,
  LeftRightVector,
  LeftTeeArrow,
  LeftTee,
  LeftTeeVector,
  leftthreetimes,
  LeftTriangleBar,
  LeftTriangle,
  LeftTriangleEqual,
  LeftUpDownVector,
  LeftUpTeeVector,
  LeftUpVectorBar,
  LeftUpVector,
  LeftVectorBar,
  LeftVector,
  lEg,
  leg,
  leq,
  leqq,
  leqslant,
  lescc,
  les,
  lesdot,
  lesdoto,
  lesdotor,
  lesg,
  lesges,
  lessapprox,
  lessdot,
  lesseqgtr,
  lesseqqgtr,
  LessEqualGreater,
  LessFullEqual,
  LessGreater,
  lessgtr,
  LessLess,
  lesssim,
  LessSlantEqual,
  LessTilde,
  lfisht,
  lfloor,
  Lfr,
  lfr,
  lg,
  lgE,
  lHar,
  lhard,
  lharu,
  lharul,
  lhblk,
  LJcy,
  ljcy,
  llarr,
  ll,
  Ll,
  llcorner,
  Lleftarrow,
  llhard,
  lltri,
  Lmidot,
  lmidot,
  lmoustache,
  lmoust,
  lnap,
  lnapprox,
  lne,
  lnE,
  lneq,
  lneqq,
  lnsim,
  loang,
  loarr,
  lobrk,
  longleftarrow,
  LongLeftArrow,
  Longleftarrow,
  longleftrightarrow,
  LongLeftRightArrow,
  Longleftrightarrow,
  longmapsto,
  longrightarrow,
  LongRightArrow,
  Longrightarrow,
  looparrowleft,
  looparrowright,
  lopar,
  Lopf,
  lopf,
  loplus,
  lotimes,
  lowast,
  lowbar,
  LowerLeftArrow,
  LowerRightArrow,
  loz,
  lozenge,
  lozf,
  lpar,
  lparlt,
  lrarr,
  lrcorner,
  lrhar,
  lrhard,
  lrm,
  lrtri,
  lsaquo,
  lscr,
  Lscr,
  lsh,
  Lsh,
  lsim,
  lsime,
  lsimg,
  lsqb,
  lsquo,
  lsquor,
  Lstrok,
  lstrok,
  ltcc,
  ltcir,
  lt: lt$2,
  LT: LT$1,
  Lt,
  ltdot,
  lthree,
  ltimes,
  ltlarr,
  ltquest,
  ltri,
  ltrie,
  ltrif,
  ltrPar,
  lurdshar,
  luruhar,
  lvertneqq,
  lvnE,
  macr: macr$1,
  male,
  malt,
  maltese,
  "Map": "\u2905",
  map,
  mapsto,
  mapstodown,
  mapstoleft,
  mapstoup,
  marker,
  mcomma,
  Mcy,
  mcy,
  mdash,
  mDDot,
  measuredangle,
  MediumSpace,
  Mellintrf,
  Mfr,
  mfr,
  mho,
  micro: micro$1,
  midast,
  midcir,
  mid,
  middot: middot$1,
  minusb,
  minus,
  minusd,
  minusdu,
  MinusPlus,
  mlcp,
  mldr,
  mnplus,
  models,
  Mopf,
  mopf,
  mp,
  mscr,
  Mscr,
  mstpos,
  Mu,
  mu,
  multimap,
  mumap,
  nabla,
  Nacute,
  nacute,
  nang,
  nap,
  napE,
  napid,
  napos,
  napprox,
  natural,
  naturals,
  natur,
  nbsp: nbsp$1,
  nbump,
  nbumpe,
  ncap,
  Ncaron,
  ncaron,
  Ncedil,
  ncedil,
  ncong,
  ncongdot,
  ncup,
  Ncy,
  ncy,
  ndash,
  nearhk,
  nearr,
  neArr,
  nearrow,
  ne,
  nedot,
  NegativeMediumSpace,
  NegativeThickSpace,
  NegativeThinSpace,
  NegativeVeryThinSpace,
  nequiv,
  nesear,
  nesim,
  NestedGreaterGreater,
  NestedLessLess,
  NewLine,
  nexist,
  nexists,
  Nfr,
  nfr,
  ngE,
  nge,
  ngeq,
  ngeqq,
  ngeqslant,
  nges,
  nGg,
  ngsim,
  nGt,
  ngt,
  ngtr,
  nGtv,
  nharr,
  nhArr,
  nhpar,
  ni,
  nis,
  nisd,
  niv,
  NJcy,
  njcy,
  nlarr,
  nlArr,
  nldr,
  nlE,
  nle,
  nleftarrow,
  nLeftarrow,
  nleftrightarrow,
  nLeftrightarrow,
  nleq,
  nleqq,
  nleqslant,
  nles,
  nless,
  nLl,
  nlsim,
  nLt,
  nlt,
  nltri,
  nltrie,
  nLtv,
  nmid,
  NoBreak,
  NonBreakingSpace,
  nopf,
  Nopf,
  Not,
  not: not$1,
  NotCongruent,
  NotCupCap,
  NotDoubleVerticalBar,
  NotElement,
  NotEqual,
  NotEqualTilde,
  NotExists,
  NotGreater,
  NotGreaterEqual,
  NotGreaterFullEqual,
  NotGreaterGreater,
  NotGreaterLess,
  NotGreaterSlantEqual,
  NotGreaterTilde,
  NotHumpDownHump,
  NotHumpEqual,
  notin,
  notindot,
  notinE,
  notinva,
  notinvb,
  notinvc,
  NotLeftTriangleBar,
  NotLeftTriangle,
  NotLeftTriangleEqual,
  NotLess,
  NotLessEqual,
  NotLessGreater,
  NotLessLess,
  NotLessSlantEqual,
  NotLessTilde,
  NotNestedGreaterGreater,
  NotNestedLessLess,
  notni,
  notniva,
  notnivb,
  notnivc,
  NotPrecedes,
  NotPrecedesEqual,
  NotPrecedesSlantEqual,
  NotReverseElement,
  NotRightTriangleBar,
  NotRightTriangle,
  NotRightTriangleEqual,
  NotSquareSubset,
  NotSquareSubsetEqual,
  NotSquareSuperset,
  NotSquareSupersetEqual,
  NotSubset,
  NotSubsetEqual,
  NotSucceeds,
  NotSucceedsEqual,
  NotSucceedsSlantEqual,
  NotSucceedsTilde,
  NotSuperset,
  NotSupersetEqual,
  NotTilde,
  NotTildeEqual,
  NotTildeFullEqual,
  NotTildeTilde,
  NotVerticalBar,
  nparallel,
  npar,
  nparsl,
  npart,
  npolint,
  npr,
  nprcue,
  nprec,
  npreceq,
  npre,
  nrarrc,
  nrarr,
  nrArr,
  nrarrw,
  nrightarrow,
  nRightarrow,
  nrtri,
  nrtrie,
  nsc,
  nsccue,
  nsce,
  Nscr,
  nscr,
  nshortmid,
  nshortparallel,
  nsim,
  nsime,
  nsimeq,
  nsmid,
  nspar,
  nsqsube,
  nsqsupe,
  nsub,
  nsubE,
  nsube,
  nsubset,
  nsubseteq,
  nsubseteqq,
  nsucc,
  nsucceq,
  nsup,
  nsupE,
  nsupe,
  nsupset,
  nsupseteq,
  nsupseteqq,
  ntgl,
  Ntilde: Ntilde$1,
  ntilde: ntilde$1,
  ntlg,
  ntriangleleft,
  ntrianglelefteq,
  ntriangleright,
  ntrianglerighteq,
  Nu,
  nu,
  num,
  numero,
  numsp,
  nvap,
  nvdash,
  nvDash,
  nVdash,
  nVDash,
  nvge,
  nvgt,
  nvHarr,
  nvinfin,
  nvlArr,
  nvle,
  nvlt,
  nvltrie,
  nvrArr,
  nvrtrie,
  nvsim,
  nwarhk,
  nwarr,
  nwArr,
  nwarrow,
  nwnear,
  Oacute: Oacute$1,
  oacute: oacute$1,
  oast,
  Ocirc: Ocirc$1,
  ocirc: ocirc$1,
  ocir,
  Ocy,
  ocy,
  odash,
  Odblac,
  odblac,
  odiv,
  odot,
  odsold,
  OElig,
  oelig,
  ofcir,
  Ofr,
  ofr,
  ogon,
  Ograve: Ograve$1,
  ograve: ograve$1,
  ogt,
  ohbar,
  ohm,
  oint,
  olarr,
  olcir,
  olcross,
  oline,
  olt,
  Omacr,
  omacr,
  Omega,
  omega,
  Omicron,
  omicron,
  omid,
  ominus,
  Oopf,
  oopf,
  opar,
  OpenCurlyDoubleQuote,
  OpenCurlyQuote,
  operp,
  oplus,
  orarr,
  Or,
  or,
  ord,
  order,
  orderof,
  ordf: ordf$1,
  ordm: ordm$1,
  origof,
  oror,
  orslope,
  orv,
  oS,
  Oscr,
  oscr,
  Oslash: Oslash$1,
  oslash: oslash$1,
  osol,
  Otilde: Otilde$1,
  otilde: otilde$1,
  otimesas,
  Otimes,
  otimes,
  Ouml: Ouml$1,
  ouml: ouml$1,
  ovbar,
  OverBar,
  OverBrace,
  OverBracket,
  OverParenthesis,
  para: para$1,
  parallel,
  par,
  parsim,
  parsl,
  part,
  PartialD,
  Pcy,
  pcy,
  percnt,
  period,
  permil,
  perp,
  pertenk,
  Pfr,
  pfr,
  Phi,
  phi,
  phiv,
  phmmat,
  phone,
  Pi,
  pi,
  pitchfork,
  piv,
  planck,
  planckh,
  plankv,
  plusacir,
  plusb,
  pluscir,
  plus,
  plusdo,
  plusdu,
  pluse,
  PlusMinus,
  plusmn: plusmn$1,
  plussim,
  plustwo,
  pm,
  Poincareplane,
  pointint,
  popf,
  Popf,
  pound: pound$1,
  prap,
  Pr,
  pr,
  prcue,
  precapprox,
  prec,
  preccurlyeq,
  Precedes,
  PrecedesEqual,
  PrecedesSlantEqual,
  PrecedesTilde,
  preceq,
  precnapprox,
  precneqq,
  precnsim,
  pre,
  prE,
  precsim,
  prime,
  Prime,
  primes,
  prnap,
  prnE,
  prnsim,
  prod,
  Product,
  profalar,
  profline,
  profsurf,
  prop,
  Proportional,
  Proportion,
  propto,
  prsim,
  prurel,
  Pscr,
  pscr,
  Psi,
  psi,
  puncsp,
  Qfr,
  qfr,
  qint,
  qopf,
  Qopf,
  qprime,
  Qscr,
  qscr,
  quaternions,
  quatint,
  quest,
  questeq,
  quot: quot$2,
  QUOT: QUOT$1,
  rAarr,
  race,
  Racute,
  racute,
  radic,
  raemptyv,
  rang,
  Rang,
  rangd,
  range,
  rangle,
  raquo: raquo$1,
  rarrap,
  rarrb,
  rarrbfs,
  rarrc,
  rarr,
  Rarr,
  rArr,
  rarrfs,
  rarrhk,
  rarrlp,
  rarrpl,
  rarrsim,
  Rarrtl,
  rarrtl,
  rarrw,
  ratail,
  rAtail,
  ratio,
  rationals,
  rbarr,
  rBarr,
  RBarr,
  rbbrk,
  rbrace,
  rbrack,
  rbrke,
  rbrksld,
  rbrkslu,
  Rcaron,
  rcaron,
  Rcedil,
  rcedil,
  rceil,
  rcub,
  Rcy,
  rcy,
  rdca,
  rdldhar,
  rdquo,
  rdquor,
  rdsh,
  real,
  realine,
  realpart,
  reals,
  Re,
  rect,
  reg: reg$1,
  REG: REG$1,
  ReverseElement,
  ReverseEquilibrium,
  ReverseUpEquilibrium,
  rfisht,
  rfloor,
  rfr,
  Rfr,
  rHar,
  rhard,
  rharu,
  rharul,
  Rho,
  rho,
  rhov,
  RightAngleBracket,
  RightArrowBar,
  rightarrow,
  RightArrow,
  Rightarrow,
  RightArrowLeftArrow,
  rightarrowtail,
  RightCeiling,
  RightDoubleBracket,
  RightDownTeeVector,
  RightDownVectorBar,
  RightDownVector,
  RightFloor,
  rightharpoondown,
  rightharpoonup,
  rightleftarrows,
  rightleftharpoons,
  rightrightarrows,
  rightsquigarrow,
  RightTeeArrow,
  RightTee,
  RightTeeVector,
  rightthreetimes,
  RightTriangleBar,
  RightTriangle,
  RightTriangleEqual,
  RightUpDownVector,
  RightUpTeeVector,
  RightUpVectorBar,
  RightUpVector,
  RightVectorBar,
  RightVector,
  ring,
  risingdotseq,
  rlarr,
  rlhar,
  rlm,
  rmoustache,
  rmoust,
  rnmid,
  roang,
  roarr,
  robrk,
  ropar,
  ropf,
  Ropf,
  roplus,
  rotimes,
  RoundImplies,
  rpar,
  rpargt,
  rppolint,
  rrarr,
  Rrightarrow,
  rsaquo,
  rscr,
  Rscr,
  rsh,
  Rsh,
  rsqb,
  rsquo,
  rsquor,
  rthree,
  rtimes,
  rtri,
  rtrie,
  rtrif,
  rtriltri,
  RuleDelayed,
  ruluhar,
  rx,
  Sacute,
  sacute,
  sbquo,
  scap,
  Scaron,
  scaron,
  Sc,
  sc,
  sccue,
  sce,
  scE,
  Scedil,
  scedil,
  Scirc,
  scirc,
  scnap,
  scnE,
  scnsim,
  scpolint,
  scsim,
  Scy,
  scy,
  sdotb,
  sdot,
  sdote,
  searhk,
  searr,
  seArr,
  searrow,
  sect: sect$1,
  semi,
  seswar,
  setminus,
  setmn,
  sext,
  Sfr,
  sfr,
  sfrown,
  sharp,
  SHCHcy,
  shchcy,
  SHcy,
  shcy,
  ShortDownArrow,
  ShortLeftArrow,
  shortmid,
  shortparallel,
  ShortRightArrow,
  ShortUpArrow,
  shy: shy$1,
  Sigma,
  sigma,
  sigmaf,
  sigmav,
  sim,
  simdot,
  sime,
  simeq,
  simg,
  simgE,
  siml,
  simlE,
  simne,
  simplus,
  simrarr,
  slarr,
  SmallCircle,
  smallsetminus,
  smashp,
  smeparsl,
  smid,
  smile,
  smt,
  smte,
  smtes,
  SOFTcy,
  softcy,
  solbar,
  solb,
  sol,
  Sopf,
  sopf,
  spades,
  spadesuit,
  spar,
  sqcap,
  sqcaps,
  sqcup,
  sqcups,
  Sqrt,
  sqsub,
  sqsube,
  sqsubset,
  sqsubseteq,
  sqsup,
  sqsupe,
  sqsupset,
  sqsupseteq,
  square,
  Square,
  SquareIntersection,
  SquareSubset,
  SquareSubsetEqual,
  SquareSuperset,
  SquareSupersetEqual,
  SquareUnion,
  squarf,
  squ,
  squf,
  srarr,
  Sscr,
  sscr,
  ssetmn,
  ssmile,
  sstarf,
  Star,
  star,
  starf,
  straightepsilon,
  straightphi,
  strns,
  sub,
  Sub,
  subdot,
  subE,
  sube,
  subedot,
  submult,
  subnE,
  subne,
  subplus,
  subrarr,
  subset,
  Subset,
  subseteq,
  subseteqq,
  SubsetEqual,
  subsetneq,
  subsetneqq,
  subsim,
  subsub,
  subsup,
  succapprox,
  succ,
  succcurlyeq,
  Succeeds,
  SucceedsEqual,
  SucceedsSlantEqual,
  SucceedsTilde,
  succeq,
  succnapprox,
  succneqq,
  succnsim,
  succsim,
  SuchThat,
  sum,
  Sum,
  sung,
  sup1: sup1$1,
  sup2: sup2$1,
  sup3: sup3$1,
  sup,
  Sup,
  supdot,
  supdsub,
  supE,
  supe,
  supedot,
  Superset,
  SupersetEqual,
  suphsol,
  suphsub,
  suplarr,
  supmult,
  supnE,
  supne,
  supplus,
  supset,
  Supset,
  supseteq,
  supseteqq,
  supsetneq,
  supsetneqq,
  supsim,
  supsub,
  supsup,
  swarhk,
  swarr,
  swArr,
  swarrow,
  swnwar,
  szlig: szlig$1,
  Tab,
  target,
  Tau,
  tau,
  tbrk,
  Tcaron,
  tcaron,
  Tcedil,
  tcedil,
  Tcy,
  tcy,
  tdot,
  telrec,
  Tfr,
  tfr,
  there4,
  therefore,
  Therefore,
  Theta,
  theta,
  thetasym,
  thetav,
  thickapprox,
  thicksim,
  ThickSpace,
  ThinSpace,
  thinsp,
  thkap,
  thksim,
  THORN: THORN$1,
  thorn: thorn$1,
  tilde,
  Tilde,
  TildeEqual,
  TildeFullEqual,
  TildeTilde,
  timesbar,
  timesb,
  times: times$1,
  timesd,
  tint,
  toea,
  topbot,
  topcir,
  top,
  Topf,
  topf,
  topfork,
  tosa,
  tprime,
  trade,
  TRADE,
  triangle,
  triangledown,
  triangleleft,
  trianglelefteq,
  triangleq,
  triangleright,
  trianglerighteq,
  tridot,
  trie,
  triminus,
  TripleDot,
  triplus,
  trisb,
  tritime,
  trpezium,
  Tscr,
  tscr,
  TScy,
  tscy,
  TSHcy,
  tshcy,
  Tstrok,
  tstrok,
  twixt,
  twoheadleftarrow,
  twoheadrightarrow,
  Uacute: Uacute$1,
  uacute: uacute$1,
  uarr,
  Uarr,
  uArr,
  Uarrocir,
  Ubrcy,
  ubrcy,
  Ubreve,
  ubreve,
  Ucirc: Ucirc$1,
  ucirc: ucirc$1,
  Ucy,
  ucy,
  udarr,
  Udblac,
  udblac,
  udhar,
  ufisht,
  Ufr,
  ufr,
  Ugrave: Ugrave$1,
  ugrave: ugrave$1,
  uHar,
  uharl,
  uharr,
  uhblk,
  ulcorn,
  ulcorner,
  ulcrop,
  ultri,
  Umacr,
  umacr,
  uml: uml$1,
  UnderBar,
  UnderBrace,
  UnderBracket,
  UnderParenthesis,
  Union,
  UnionPlus,
  Uogon,
  uogon,
  Uopf,
  uopf,
  UpArrowBar,
  uparrow,
  UpArrow,
  Uparrow,
  UpArrowDownArrow,
  updownarrow,
  UpDownArrow,
  Updownarrow,
  UpEquilibrium,
  upharpoonleft,
  upharpoonright,
  uplus,
  UpperLeftArrow,
  UpperRightArrow,
  upsi,
  Upsi,
  upsih,
  Upsilon,
  upsilon,
  UpTeeArrow,
  UpTee,
  upuparrows,
  urcorn,
  urcorner,
  urcrop,
  Uring,
  uring,
  urtri,
  Uscr,
  uscr,
  utdot,
  Utilde,
  utilde,
  utri,
  utrif,
  uuarr,
  Uuml: Uuml$1,
  uuml: uuml$1,
  uwangle,
  vangrt,
  varepsilon,
  varkappa,
  varnothing,
  varphi,
  varpi,
  varpropto,
  varr,
  vArr,
  varrho,
  varsigma,
  varsubsetneq,
  varsubsetneqq,
  varsupsetneq,
  varsupsetneqq,
  vartheta,
  vartriangleleft,
  vartriangleright,
  vBar,
  Vbar,
  vBarv,
  Vcy,
  vcy,
  vdash,
  vDash,
  Vdash,
  VDash,
  Vdashl,
  veebar,
  vee,
  Vee,
  veeeq,
  vellip,
  verbar,
  Verbar,
  vert,
  Vert,
  VerticalBar,
  VerticalLine,
  VerticalSeparator,
  VerticalTilde,
  VeryThinSpace,
  Vfr,
  vfr,
  vltri,
  vnsub,
  vnsup,
  Vopf,
  vopf,
  vprop,
  vrtri,
  Vscr,
  vscr,
  vsubnE,
  vsubne,
  vsupnE,
  vsupne,
  Vvdash,
  vzigzag,
  Wcirc,
  wcirc,
  wedbar,
  wedge,
  Wedge,
  wedgeq,
  weierp,
  Wfr,
  wfr,
  Wopf,
  wopf,
  wp,
  wr,
  wreath,
  Wscr,
  wscr,
  xcap,
  xcirc,
  xcup,
  xdtri,
  Xfr,
  xfr,
  xharr,
  xhArr,
  Xi,
  xi,
  xlarr,
  xlArr,
  xmap,
  xnis,
  xodot,
  Xopf,
  xopf,
  xoplus,
  xotime,
  xrarr,
  xrArr,
  Xscr,
  xscr,
  xsqcup,
  xuplus,
  xutri,
  xvee,
  xwedge,
  Yacute: Yacute$1,
  yacute: yacute$1,
  YAcy,
  yacy,
  Ycirc,
  ycirc,
  Ycy,
  ycy,
  yen: yen$1,
  Yfr,
  yfr,
  YIcy,
  yicy,
  Yopf,
  yopf,
  Yscr,
  yscr,
  YUcy,
  yucy,
  yuml: yuml$1,
  Yuml,
  Zacute,
  zacute,
  Zcaron,
  zcaron,
  Zcy,
  zcy,
  Zdot,
  zdot,
  zeetrf,
  ZeroWidthSpace,
  Zeta,
  zeta,
  zfr,
  Zfr,
  ZHcy,
  zhcy,
  zigrarr,
  zopf,
  Zopf,
  Zscr,
  zscr,
  zwj,
  zwnj
};
const Aacute = "\xC1";
const aacute = "\xE1";
const Acirc = "\xC2";
const acirc = "\xE2";
const acute = "\xB4";
const AElig = "\xC6";
const aelig = "\xE6";
const Agrave = "\xC0";
const agrave = "\xE0";
const amp$1 = "&";
const AMP = "&";
const Aring = "\xC5";
const aring = "\xE5";
const Atilde = "\xC3";
const atilde = "\xE3";
const Auml = "\xC4";
const auml = "\xE4";
const brvbar = "\xA6";
const Ccedil = "\xC7";
const ccedil = "\xE7";
const cedil = "\xB8";
const cent = "\xA2";
const copy = "\xA9";
const COPY = "\xA9";
const curren = "\xA4";
const deg = "\xB0";
const divide = "\xF7";
const Eacute = "\xC9";
const eacute = "\xE9";
const Ecirc = "\xCA";
const ecirc = "\xEA";
const Egrave = "\xC8";
const egrave = "\xE8";
const ETH = "\xD0";
const eth = "\xF0";
const Euml = "\xCB";
const euml = "\xEB";
const frac12 = "\xBD";
const frac14 = "\xBC";
const frac34 = "\xBE";
const gt$1 = ">";
const GT = ">";
const Iacute = "\xCD";
const iacute = "\xED";
const Icirc = "\xCE";
const icirc = "\xEE";
const iexcl = "\xA1";
const Igrave = "\xCC";
const igrave = "\xEC";
const iquest = "\xBF";
const Iuml = "\xCF";
const iuml = "\xEF";
const laquo = "\xAB";
const lt$1 = "<";
const LT = "<";
const macr = "\xAF";
const micro = "\xB5";
const middot = "\xB7";
const nbsp = "\xA0";
const not = "\xAC";
const Ntilde = "\xD1";
const ntilde = "\xF1";
const Oacute = "\xD3";
const oacute = "\xF3";
const Ocirc = "\xD4";
const ocirc = "\xF4";
const Ograve = "\xD2";
const ograve = "\xF2";
const ordf = "\xAA";
const ordm = "\xBA";
const Oslash = "\xD8";
const oslash = "\xF8";
const Otilde = "\xD5";
const otilde = "\xF5";
const Ouml = "\xD6";
const ouml = "\xF6";
const para = "\xB6";
const plusmn = "\xB1";
const pound = "\xA3";
const quot$1 = '"';
const QUOT = '"';
const raquo = "\xBB";
const reg = "\xAE";
const REG = "\xAE";
const sect = "\xA7";
const shy = "\xAD";
const sup1 = "\xB9";
const sup2 = "\xB2";
const sup3 = "\xB3";
const szlig = "\xDF";
const THORN = "\xDE";
const thorn = "\xFE";
const times = "\xD7";
const Uacute = "\xDA";
const uacute = "\xFA";
const Ucirc = "\xDB";
const ucirc = "\xFB";
const Ugrave = "\xD9";
const ugrave = "\xF9";
const uml = "\xA8";
const Uuml = "\xDC";
const uuml = "\xFC";
const Yacute = "\xDD";
const yacute = "\xFD";
const yen = "\xA5";
const yuml = "\xFF";
const require$$1 = {
  Aacute,
  aacute,
  Acirc,
  acirc,
  acute,
  AElig,
  aelig,
  Agrave,
  agrave,
  amp: amp$1,
  AMP,
  Aring,
  aring,
  Atilde,
  atilde,
  Auml,
  auml,
  brvbar,
  Ccedil,
  ccedil,
  cedil,
  cent,
  copy,
  COPY,
  curren,
  deg,
  divide,
  Eacute,
  eacute,
  Ecirc,
  ecirc,
  Egrave,
  egrave,
  ETH,
  eth,
  Euml,
  euml,
  frac12,
  frac14,
  frac34,
  gt: gt$1,
  GT,
  Iacute,
  iacute,
  Icirc,
  icirc,
  iexcl,
  Igrave,
  igrave,
  iquest,
  Iuml,
  iuml,
  laquo,
  lt: lt$1,
  LT,
  macr,
  micro,
  middot,
  nbsp,
  not,
  Ntilde,
  ntilde,
  Oacute,
  oacute,
  Ocirc,
  ocirc,
  Ograve,
  ograve,
  ordf,
  ordm,
  Oslash,
  oslash,
  Otilde,
  otilde,
  Ouml,
  ouml,
  para,
  plusmn,
  pound,
  quot: quot$1,
  QUOT,
  raquo,
  reg,
  REG,
  sect,
  shy,
  sup1,
  sup2,
  sup3,
  szlig,
  THORN,
  thorn,
  times,
  Uacute,
  uacute,
  Ucirc,
  ucirc,
  Ugrave,
  ugrave,
  uml,
  Uuml,
  uuml,
  Yacute,
  yacute,
  yen,
  yuml
};
const amp = "&";
const apos = "'";
const gt = ">";
const lt = "<";
const quot = '"';
const require$$0$1 = {
  amp,
  apos,
  gt,
  lt,
  quot
};
var decode_codepoint = {};
const require$$0 = {
  "0": 65533,
  "128": 8364,
  "130": 8218,
  "131": 402,
  "132": 8222,
  "133": 8230,
  "134": 8224,
  "135": 8225,
  "136": 710,
  "137": 8240,
  "138": 352,
  "139": 8249,
  "140": 338,
  "142": 381,
  "145": 8216,
  "146": 8217,
  "147": 8220,
  "148": 8221,
  "149": 8226,
  "150": 8211,
  "151": 8212,
  "152": 732,
  "153": 8482,
  "154": 353,
  "155": 8250,
  "156": 339,
  "158": 382,
  "159": 376
};
var hasRequiredDecode_codepoint;
function requireDecode_codepoint() {
  if (hasRequiredDecode_codepoint)
    return decode_codepoint;
  hasRequiredDecode_codepoint = 1;
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(decode_codepoint, "__esModule", { value: true });
  var decode_json_1 = __importDefault(require$$0);
  var fromCodePoint = String.fromCodePoint || function(codePoint) {
    var output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  };
  function decodeCodePoint2(codePoint) {
    if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
      return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
      codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint(codePoint);
  }
  decode_codepoint.default = decodeCodePoint2;
  return decode_codepoint;
}
var hasRequiredDecode;
function requireDecode() {
  if (hasRequiredDecode)
    return decode2;
  hasRequiredDecode = 1;
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(decode2, "__esModule", { value: true });
  decode2.decodeHTML = decode2.decodeHTMLStrict = decode2.decodeXML = void 0;
  var entities_json_1 = __importDefault(require$$1$1);
  var legacy_json_1 = __importDefault(require$$1);
  var xml_json_1 = __importDefault(require$$0$1);
  var decode_codepoint_1 = __importDefault(requireDecode_codepoint());
  var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
  decode2.decodeXML = getStrictDecoder(xml_json_1.default);
  decode2.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
  function getStrictDecoder(map2) {
    var replace = getReplacer(map2);
    return function(str) {
      return String(str).replace(strictEntityRe, replace);
    };
  }
  var sorter = function(a, b) {
    return a < b ? 1 : -1;
  };
  decode2.decodeHTML = function() {
    var legacy2 = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i2 = 0, j2 = 0; i2 < keys.length; i2++) {
      if (legacy2[j2] === keys[i2]) {
        keys[i2] += ";?";
        j2++;
      } else {
        keys[i2] += ";";
      }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
      if (str.substr(-1) !== ";")
        str += ";";
      return replace(str);
    }
    return function(str) {
      return String(str).replace(re, replacer);
    };
  }();
  function getReplacer(map2) {
    return function replace(str) {
      if (str.charAt(1) === "#") {
        var secondChar = str.charAt(2);
        if (secondChar === "X" || secondChar === "x") {
          return decode_codepoint_1.default(parseInt(str.substr(3), 16));
        }
        return decode_codepoint_1.default(parseInt(str.substr(2), 10));
      }
      return map2[str.slice(1, -1)] || str;
    };
  }
  return decode2;
}
var encode2 = {};
var hasRequiredEncode;
function requireEncode() {
  if (hasRequiredEncode)
    return encode2;
  hasRequiredEncode = 1;
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(encode2, "__esModule", { value: true });
  encode2.escapeUTF8 = encode2.escape = encode2.encodeNonAsciiHTML = encode2.encodeHTML = encode2.encodeXML = void 0;
  var xml_json_1 = __importDefault(require$$0$1);
  var inverseXML = getInverseObj(xml_json_1.default);
  var xmlReplacer = getInverseReplacer(inverseXML);
  encode2.encodeXML = getASCIIEncoder(inverseXML);
  var entities_json_1 = __importDefault(require$$1$1);
  var inverseHTML = getInverseObj(entities_json_1.default);
  var htmlReplacer = getInverseReplacer(inverseHTML);
  encode2.encodeHTML = getInverse(inverseHTML, htmlReplacer);
  encode2.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
  function getInverseObj(obj) {
    return Object.keys(obj).sort().reduce(function(inverse, name) {
      inverse[obj[name]] = "&" + name + ";";
      return inverse;
    }, {});
  }
  function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
      var k = _a[_i];
      if (k.length === 1) {
        single.push("\\" + k);
      } else {
        multiple.push(k);
      }
    }
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
      var end = start;
      while (end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
        end += 1;
      }
      var count = 1 + end - start;
      if (count < 3)
        continue;
      single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
  }
  var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
  var getCodePoint = String.prototype.codePointAt != null ? function(str) {
    return str.codePointAt(0);
  } : function(c) {
    return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
  };
  function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
  }
  function getInverse(inverse, re) {
    return function(data) {
      return data.replace(re, function(name) {
        return inverse[name];
      }).replace(reNonASCII, singleCharReplacer);
    };
  }
  var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
  function escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
  }
  encode2.escape = escape;
  function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
  }
  encode2.escapeUTF8 = escapeUTF8;
  function getASCIIEncoder(obj) {
    return function(data) {
      return data.replace(reEscapeChars, function(c) {
        return obj[c] || singleCharReplacer(c);
      });
    };
  }
  return encode2;
}
var hasRequiredLib$1;
function requireLib$1() {
  if (hasRequiredLib$1)
    return lib;
  hasRequiredLib$1 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
    var decode_1 = requireDecode();
    var encode_1 = requireEncode();
    function decode3(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports.decode = decode3;
    function decodeStrict(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports.decodeStrict = decodeStrict;
    function encode3(data, level) {
      return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports.encode = encode3;
    var encode_2 = requireEncode();
    Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() {
      return encode_2.encodeXML;
    } });
    Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports, "escape", { enumerable: true, get: function() {
      return encode_2.escape;
    } });
    Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() {
      return encode_2.escapeUTF8;
    } });
    Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    var decode_2 = requireDecode();
    Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
    Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
  })(lib);
  return lib;
}
const elementNames = {
  altglyph: "altGlyph",
  altglyphdef: "altGlyphDef",
  altglyphitem: "altGlyphItem",
  animatecolor: "animateColor",
  animatemotion: "animateMotion",
  animatetransform: "animateTransform",
  clippath: "clipPath",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  foreignobject: "foreignObject",
  glyphref: "glyphRef",
  lineargradient: "linearGradient",
  radialgradient: "radialGradient",
  textpath: "textPath"
};
const attributeNames = {
  definitionurl: "definitionURL",
  attributename: "attributeName",
  attributetype: "attributeType",
  basefrequency: "baseFrequency",
  baseprofile: "baseProfile",
  calcmode: "calcMode",
  clippathunits: "clipPathUnits",
  diffuseconstant: "diffuseConstant",
  edgemode: "edgeMode",
  filterunits: "filterUnits",
  glyphref: "glyphRef",
  gradienttransform: "gradientTransform",
  gradientunits: "gradientUnits",
  kernelmatrix: "kernelMatrix",
  kernelunitlength: "kernelUnitLength",
  keypoints: "keyPoints",
  keysplines: "keySplines",
  keytimes: "keyTimes",
  lengthadjust: "lengthAdjust",
  limitingconeangle: "limitingConeAngle",
  markerheight: "markerHeight",
  markerunits: "markerUnits",
  markerwidth: "markerWidth",
  maskcontentunits: "maskContentUnits",
  maskunits: "maskUnits",
  numoctaves: "numOctaves",
  pathlength: "pathLength",
  patterncontentunits: "patternContentUnits",
  patterntransform: "patternTransform",
  patternunits: "patternUnits",
  pointsatx: "pointsAtX",
  pointsaty: "pointsAtY",
  pointsatz: "pointsAtZ",
  preservealpha: "preserveAlpha",
  preserveaspectratio: "preserveAspectRatio",
  primitiveunits: "primitiveUnits",
  refx: "refX",
  refy: "refY",
  repeatcount: "repeatCount",
  repeatdur: "repeatDur",
  requiredextensions: "requiredExtensions",
  requiredfeatures: "requiredFeatures",
  specularconstant: "specularConstant",
  specularexponent: "specularExponent",
  spreadmethod: "spreadMethod",
  startoffset: "startOffset",
  stddeviation: "stdDeviation",
  stitchtiles: "stitchTiles",
  surfacescale: "surfaceScale",
  systemlanguage: "systemLanguage",
  tablevalues: "tableValues",
  targetx: "targetX",
  targety: "targetY",
  textlength: "textLength",
  viewbox: "viewBox",
  viewtarget: "viewTarget",
  xchannelselector: "xChannelSelector",
  ychannelselector: "yChannelSelector",
  zoomandpan: "zoomAndPan"
};
const require$$2 = {
  elementNames,
  attributeNames
};
var hasRequiredDomSerializer;
function requireDomSerializer() {
  if (hasRequiredDomSerializer)
    return domSerializer.exports;
  hasRequiredDomSerializer = 1;
  var ElementType2 = requireLib$2();
  var entities2 = requireLib$1();
  var foreignNames = require$$2;
  foreignNames.elementNames.__proto__ = null;
  foreignNames.attributeNames.__proto__ = null;
  var unencodedElements = {
    __proto__: null,
    style: true,
    script: true,
    xmp: true,
    iframe: true,
    noembed: true,
    noframes: true,
    plaintext: true,
    noscript: true
  };
  function formatAttrs(attributes, opts) {
    if (!attributes)
      return;
    var output = "";
    var value;
    for (var key in attributes) {
      value = attributes[key];
      if (output) {
        output += " ";
      }
      if (opts.xmlMode === "foreign") {
        key = foreignNames.attributeNames[key] || key;
      }
      output += key;
      if (value !== null && value !== "" || opts.xmlMode) {
        output += '="' + (opts.decodeEntities ? entities2.encodeXML(value) : value.replace(/\"/g, "&quot;")) + '"';
      }
    }
    return output;
  }
  var singleTag = {
    __proto__: null,
    area: true,
    base: true,
    basefont: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    frame: true,
    hr: true,
    img: true,
    input: true,
    isindex: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
  };
  var render2 = domSerializer.exports = function(dom, opts) {
    if (!Array.isArray(dom) && !dom.cheerio)
      dom = [dom];
    opts = opts || {};
    var output = "";
    for (var i2 = 0; i2 < dom.length; i2++) {
      var elem = dom[i2];
      if (elem.type === "root")
        output += render2(elem.children, opts);
      else if (ElementType2.isTag(elem))
        output += renderTag(elem, opts);
      else if (elem.type === ElementType2.Directive)
        output += renderDirective(elem);
      else if (elem.type === ElementType2.Comment)
        output += renderComment(elem);
      else if (elem.type === ElementType2.CDATA)
        output += renderCdata(elem);
      else
        output += renderText(elem, opts);
    }
    return output;
  };
  var foreignModeIntegrationPoints = [
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title"
  ];
  function renderTag(elem, opts) {
    if (opts.xmlMode === "foreign") {
      elem.name = foreignNames.elementNames[elem.name] || elem.name;
      if (elem.parent && foreignModeIntegrationPoints.indexOf(elem.parent.name) >= 0)
        opts = Object.assign({}, opts, { xmlMode: false });
    }
    if (!opts.xmlMode && ["svg", "math"].indexOf(elem.name) >= 0) {
      opts = Object.assign({}, opts, { xmlMode: "foreign" });
    }
    var tag = "<" + elem.name;
    var attribs = formatAttrs(elem.attribs, opts);
    if (attribs) {
      tag += " " + attribs;
    }
    if (opts.xmlMode && (!elem.children || elem.children.length === 0)) {
      tag += "/>";
    } else {
      tag += ">";
      if (elem.children) {
        tag += render2(elem.children, opts);
      }
      if (!singleTag[elem.name] || opts.xmlMode) {
        tag += "</" + elem.name + ">";
      }
    }
    return tag;
  }
  function renderDirective(elem) {
    return "<" + elem.data + ">";
  }
  function renderText(elem, opts) {
    var data = elem.data || "";
    if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
      data = entities2.encodeXML(data);
    }
    return data;
  }
  function renderCdata(elem) {
    return "<![CDATA[" + elem.children[0].data + "]]>";
  }
  function renderComment(elem) {
    return "<!--" + elem.data + "-->";
  }
  return domSerializer.exports;
}
var stringify;
var hasRequiredStringify;
function requireStringify() {
  if (hasRequiredStringify)
    return stringify;
  hasRequiredStringify = 1;
  var ElementType2 = domelementtype, getOuterHTML = requireDomSerializer(), isTag = ElementType2.isTag;
  stringify = {
    getInnerHTML,
    getOuterHTML,
    getText
  };
  function getInnerHTML(elem, opts) {
    return elem.children ? elem.children.map(function(elem2) {
      return getOuterHTML(elem2, opts);
    }).join("") : "";
  }
  function getText(elem) {
    if (Array.isArray(elem))
      return elem.map(getText).join("");
    if (isTag(elem))
      return elem.name === "br" ? "\n" : getText(elem.children);
    if (elem.type === ElementType2.CDATA)
      return getText(elem.children);
    if (elem.type === ElementType2.Text)
      return elem.data;
    return "";
  }
  return stringify;
}
var traversal = {};
var hasRequiredTraversal;
function requireTraversal() {
  if (hasRequiredTraversal)
    return traversal;
  hasRequiredTraversal = 1;
  var getChildren = traversal.getChildren = function(elem) {
    return elem.children;
  };
  var getParent = traversal.getParent = function(elem) {
    return elem.parent;
  };
  traversal.getSiblings = function(elem) {
    var parent = getParent(elem);
    return parent ? getChildren(parent) : [elem];
  };
  traversal.getAttributeValue = function(elem, name) {
    return elem.attribs && elem.attribs[name];
  };
  traversal.hasAttrib = function(elem, name) {
    return !!elem.attribs && hasOwnProperty.call(elem.attribs, name);
  };
  traversal.getName = function(elem) {
    return elem.name;
  };
  return traversal;
}
var manipulation = {};
var hasRequiredManipulation;
function requireManipulation() {
  if (hasRequiredManipulation)
    return manipulation;
  hasRequiredManipulation = 1;
  manipulation.removeElement = function(elem) {
    if (elem.prev)
      elem.prev.next = elem.next;
    if (elem.next)
      elem.next.prev = elem.prev;
    if (elem.parent) {
      var childs = elem.parent.children;
      childs.splice(childs.lastIndexOf(elem), 1);
    }
  };
  manipulation.replaceElement = function(elem, replacement) {
    var prev = replacement.prev = elem.prev;
    if (prev) {
      prev.next = replacement;
    }
    var next = replacement.next = elem.next;
    if (next) {
      next.prev = replacement;
    }
    var parent = replacement.parent = elem.parent;
    if (parent) {
      var childs = parent.children;
      childs[childs.lastIndexOf(elem)] = replacement;
    }
  };
  manipulation.appendChild = function(elem, child) {
    child.parent = elem;
    if (elem.children.push(child) !== 1) {
      var sibling = elem.children[elem.children.length - 2];
      sibling.next = child;
      child.prev = sibling;
      child.next = null;
    }
  };
  manipulation.append = function(elem, next) {
    var parent = elem.parent, currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
      currNext.prev = next;
      if (parent) {
        var childs = parent.children;
        childs.splice(childs.lastIndexOf(currNext), 0, next);
      }
    } else if (parent) {
      parent.children.push(next);
    }
  };
  manipulation.prepend = function(elem, prev) {
    var parent = elem.parent;
    if (parent) {
      var childs = parent.children;
      childs.splice(childs.lastIndexOf(elem), 0, prev);
    }
    if (elem.prev) {
      elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
  };
  return manipulation;
}
var querying;
var hasRequiredQuerying;
function requireQuerying() {
  if (hasRequiredQuerying)
    return querying;
  hasRequiredQuerying = 1;
  var isTag = domelementtype.isTag;
  querying = {
    filter,
    find,
    findOneChild,
    findOne,
    existsOne,
    findAll
  };
  function filter(test, element2, recurse2, limit) {
    if (!Array.isArray(element2))
      element2 = [element2];
    if (typeof limit !== "number" || !isFinite(limit)) {
      limit = Infinity;
    }
    return find(test, element2, recurse2 !== false, limit);
  }
  function find(test, elems, recurse2, limit) {
    var result = [], childs;
    for (var i2 = 0, j2 = elems.length; i2 < j2; i2++) {
      if (test(elems[i2])) {
        result.push(elems[i2]);
        if (--limit <= 0)
          break;
      }
      childs = elems[i2].children;
      if (recurse2 && childs && childs.length > 0) {
        childs = find(test, childs, recurse2, limit);
        result = result.concat(childs);
        limit -= childs.length;
        if (limit <= 0)
          break;
      }
    }
    return result;
  }
  function findOneChild(test, elems) {
    for (var i2 = 0, l = elems.length; i2 < l; i2++) {
      if (test(elems[i2]))
        return elems[i2];
    }
    return null;
  }
  function findOne(test, elems) {
    var elem = null;
    for (var i2 = 0, l = elems.length; i2 < l && !elem; i2++) {
      if (!isTag(elems[i2])) {
        continue;
      } else if (test(elems[i2])) {
        elem = elems[i2];
      } else if (elems[i2].children.length > 0) {
        elem = findOne(test, elems[i2].children);
      }
    }
    return elem;
  }
  function existsOne(test, elems) {
    for (var i2 = 0, l = elems.length; i2 < l; i2++) {
      if (isTag(elems[i2]) && (test(elems[i2]) || elems[i2].children.length > 0 && existsOne(test, elems[i2].children))) {
        return true;
      }
    }
    return false;
  }
  function findAll(test, rootElems) {
    var result = [];
    var stack = rootElems.slice();
    while (stack.length) {
      var elem = stack.shift();
      if (!isTag(elem))
        continue;
      if (elem.children && elem.children.length > 0) {
        stack.unshift.apply(stack, elem.children);
      }
      if (test(elem))
        result.push(elem);
    }
    return result;
  }
  return querying;
}
var legacy = {};
var hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy)
    return legacy;
  hasRequiredLegacy = 1;
  var ElementType2 = domelementtype;
  var isTag = legacy.isTag = ElementType2.isTag;
  legacy.testElement = function(options, element2) {
    for (var key in options) {
      if (!options.hasOwnProperty(key))
        ;
      else if (key === "tag_name") {
        if (!isTag(element2) || !options.tag_name(element2.name)) {
          return false;
        }
      } else if (key === "tag_type") {
        if (!options.tag_type(element2.type))
          return false;
      } else if (key === "tag_contains") {
        if (isTag(element2) || !options.tag_contains(element2.data)) {
          return false;
        }
      } else if (!element2.attribs || !options[key](element2.attribs[key])) {
        return false;
      }
    }
    return true;
  };
  var Checks = {
    tag_name: function(name) {
      if (typeof name === "function") {
        return function(elem) {
          return isTag(elem) && name(elem.name);
        };
      } else if (name === "*") {
        return isTag;
      } else {
        return function(elem) {
          return isTag(elem) && elem.name === name;
        };
      }
    },
    tag_type: function(type2) {
      if (typeof type2 === "function") {
        return function(elem) {
          return type2(elem.type);
        };
      } else {
        return function(elem) {
          return elem.type === type2;
        };
      }
    },
    tag_contains: function(data) {
      if (typeof data === "function") {
        return function(elem) {
          return !isTag(elem) && data(elem.data);
        };
      } else {
        return function(elem) {
          return !isTag(elem) && elem.data === data;
        };
      }
    }
  };
  function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
      return function(elem) {
        return elem.attribs && value(elem.attribs[attrib]);
      };
    } else {
      return function(elem) {
        return elem.attribs && elem.attribs[attrib] === value;
      };
    }
  }
  function combineFuncs(a, b) {
    return function(elem) {
      return a(elem) || b(elem);
    };
  }
  legacy.getElements = function(options, element2, recurse2, limit) {
    var funcs = Object.keys(options).map(function(key) {
      var value = options[key];
      return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? [] : this.filter(
      funcs.reduce(combineFuncs),
      element2,
      recurse2,
      limit
    );
  };
  legacy.getElementById = function(id, element2, recurse2) {
    if (!Array.isArray(element2))
      element2 = [element2];
    return this.findOne(getAttribCheck("id", id), element2, recurse2 !== false);
  };
  legacy.getElementsByTagName = function(name, element2, recurse2, limit) {
    return this.filter(Checks.tag_name(name), element2, recurse2, limit);
  };
  legacy.getElementsByTagType = function(type2, element2, recurse2, limit) {
    return this.filter(Checks.tag_type(type2), element2, recurse2, limit);
  };
  return legacy;
}
var helpers = {};
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers)
    return helpers;
  hasRequiredHelpers = 1;
  helpers.removeSubsets = function(nodes) {
    var idx = nodes.length, node2, ancestor, replace;
    while (--idx > -1) {
      node2 = ancestor = nodes[idx];
      nodes[idx] = null;
      replace = true;
      while (ancestor) {
        if (nodes.indexOf(ancestor) > -1) {
          replace = false;
          nodes.splice(idx, 1);
          break;
        }
        ancestor = ancestor.parent;
      }
      if (replace) {
        nodes[idx] = node2;
      }
    }
    return nodes;
  };
  var POSITION = {
    DISCONNECTED: 1,
    PRECEDING: 2,
    FOLLOWING: 4,
    CONTAINS: 8,
    CONTAINED_BY: 16
  };
  var comparePos = helpers.compareDocumentPosition = function(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    var current, sharedParent, siblings, aSibling, bSibling, idx;
    if (nodeA === nodeB) {
      return 0;
    }
    current = nodeA;
    while (current) {
      aParents.unshift(current);
      current = current.parent;
    }
    current = nodeB;
    while (current) {
      bParents.unshift(current);
      current = current.parent;
    }
    idx = 0;
    while (aParents[idx] === bParents[idx]) {
      idx++;
    }
    if (idx === 0) {
      return POSITION.DISCONNECTED;
    }
    sharedParent = aParents[idx - 1];
    siblings = sharedParent.children;
    aSibling = aParents[idx];
    bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
      if (sharedParent === nodeB) {
        return POSITION.FOLLOWING | POSITION.CONTAINED_BY;
      }
      return POSITION.FOLLOWING;
    } else {
      if (sharedParent === nodeA) {
        return POSITION.PRECEDING | POSITION.CONTAINS;
      }
      return POSITION.PRECEDING;
    }
  };
  helpers.uniqueSort = function(nodes) {
    var idx = nodes.length, node2, position;
    nodes = nodes.slice();
    while (--idx > -1) {
      node2 = nodes[idx];
      position = nodes.indexOf(node2);
      if (position > -1 && position < idx) {
        nodes.splice(idx, 1);
      }
    }
    nodes.sort(function(a, b) {
      var relative = comparePos(a, b);
      if (relative & POSITION.PRECEDING) {
        return -1;
      } else if (relative & POSITION.FOLLOWING) {
        return 1;
      }
      return 0;
    });
    return nodes;
  };
  return helpers;
}
var hasRequiredDomutils;
function requireDomutils() {
  if (hasRequiredDomutils)
    return domutils.exports;
  hasRequiredDomutils = 1;
  (function(module) {
    var DomUtils = module.exports;
    [
      requireStringify(),
      requireTraversal(),
      requireManipulation(),
      requireQuerying(),
      requireLegacy(),
      requireHelpers()
    ].forEach(function(ext) {
      Object.keys(ext).forEach(function(key) {
        DomUtils[key] = ext[key].bind(DomUtils);
      });
    });
  })(domutils);
  return domutils.exports;
}
var FeedHandler_1;
var hasRequiredFeedHandler;
function requireFeedHandler() {
  if (hasRequiredFeedHandler)
    return FeedHandler_1;
  hasRequiredFeedHandler = 1;
  var DomHandler2 = domhandler;
  var DomUtils = requireDomutils();
  function FeedHandler(callback, options) {
    this.init(callback, options);
  }
  inherits_browser.exports(FeedHandler, DomHandler2);
  FeedHandler.prototype.init = DomHandler2;
  function getElements(what, where) {
    return DomUtils.getElementsByTagName(what, where, true);
  }
  function getOneElement(what, where) {
    return DomUtils.getElementsByTagName(what, where, true, 1)[0];
  }
  function fetch(what, where, recurse2) {
    return DomUtils.getText(
      DomUtils.getElementsByTagName(what, where, recurse2, 1)
    ).trim();
  }
  function addConditionally(obj, prop2, what, where, recurse2) {
    var tmp = fetch(what, where, recurse2);
    if (tmp)
      obj[prop2] = tmp;
  }
  var isValidFeed = function(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
  };
  FeedHandler.prototype.onend = function() {
    var feed = {}, feedRoot = getOneElement(isValidFeed, this.dom), tmp, childs;
    if (feedRoot) {
      if (feedRoot.name === "feed") {
        childs = feedRoot.children;
        feed.type = "atom";
        addConditionally(feed, "id", "id", childs);
        addConditionally(feed, "title", "title", childs);
        if ((tmp = getOneElement("link", childs)) && (tmp = tmp.attribs) && (tmp = tmp.href))
          feed.link = tmp;
        addConditionally(feed, "description", "subtitle", childs);
        if (tmp = fetch("updated", childs))
          feed.updated = new Date(tmp);
        addConditionally(feed, "author", "email", childs, true);
        feed.items = getElements("entry", childs).map(function(item) {
          var entry = {}, tmp2;
          item = item.children;
          addConditionally(entry, "id", "id", item);
          addConditionally(entry, "title", "title", item);
          if ((tmp2 = getOneElement("link", item)) && (tmp2 = tmp2.attribs) && (tmp2 = tmp2.href))
            entry.link = tmp2;
          if (tmp2 = fetch("summary", item) || fetch("content", item))
            entry.description = tmp2;
          if (tmp2 = fetch("updated", item))
            entry.pubDate = new Date(tmp2);
          return entry;
        });
      } else {
        childs = getOneElement("channel", feedRoot.children).children;
        feed.type = feedRoot.name.substr(0, 3);
        feed.id = "";
        addConditionally(feed, "title", "title", childs);
        addConditionally(feed, "link", "link", childs);
        addConditionally(feed, "description", "description", childs);
        if (tmp = fetch("lastBuildDate", childs))
          feed.updated = new Date(tmp);
        addConditionally(feed, "author", "managingEditor", childs, true);
        feed.items = getElements("item", feedRoot.children).map(function(item) {
          var entry = {}, tmp2;
          item = item.children;
          addConditionally(entry, "id", "guid", item);
          addConditionally(entry, "title", "title", item);
          addConditionally(entry, "link", "link", item);
          addConditionally(entry, "description", "description", item);
          if (tmp2 = fetch("pubDate", item))
            entry.pubDate = new Date(tmp2);
          return entry;
        });
      }
    }
    this.dom = feed;
    DomHandler2.prototype._handleCallback.call(
      this,
      feedRoot ? null : Error("couldn't find root of feed")
    );
  };
  FeedHandler_1 = FeedHandler;
  return FeedHandler_1;
}
var string_decoder = {};
var safeBuffer = { exports: {} };
var buffer = {};
var base64Js = {};
var hasRequiredBase64Js;
function requireBase64Js() {
  if (hasRequiredBase64Js)
    return base64Js;
  hasRequiredBase64Js = 1;
  base64Js.byteLength = byteLength;
  base64Js.toByteArray = toByteArray;
  base64Js.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i2 = 0, len = code.length; i2 < len; ++i2) {
    lookup[i2] = code[i2];
    revLookup[code.charCodeAt(i2)] = i2;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1)
      validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i3;
    for (i3 = 0; i3 < len2; i3 += 4) {
      tmp = revLookup[b64.charCodeAt(i3)] << 18 | revLookup[b64.charCodeAt(i3 + 1)] << 12 | revLookup[b64.charCodeAt(i3 + 2)] << 6 | revLookup[b64.charCodeAt(i3 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i3)] << 2 | revLookup[b64.charCodeAt(i3 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i3)] << 10 | revLookup[b64.charCodeAt(i3 + 1)] << 4 | revLookup[b64.charCodeAt(i3 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num2) {
    return lookup[num2 >> 18 & 63] + lookup[num2 >> 12 & 63] + lookup[num2 >> 6 & 63] + lookup[num2 & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i3 = start; i3 < end; i3 += 3) {
      tmp = (uint8[i3] << 16 & 16711680) + (uint8[i3 + 1] << 8 & 65280) + (uint8[i3 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i3 = 0, len22 = len2 - extraBytes; i3 < len22; i3 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i3, i3 + maxChunkLength > len22 ? len22 : i3 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
      );
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
      );
    }
    return parts.join("");
  }
  return base64Js;
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredIeee754;
function requireIeee754() {
  if (hasRequiredIeee754)
    return ieee754;
  hasRequiredIeee754 = 1;
  ieee754.read = function(buffer2, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i2 = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer2[offset + i2];
    i2 += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer2[offset + i2], i2 += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer2[offset + i2], i2 += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  ieee754.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i2 = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer2[offset + i2] = m & 255, i2 += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer2[offset + i2] = e & 255, i2 += d, e /= 256, eLen -= 8) {
    }
    buffer2[offset + i2 - d] |= s * 128;
  };
  return ieee754;
}
var isarray;
var hasRequiredIsarray;
function requireIsarray() {
  if (hasRequiredIsarray)
    return isarray;
  hasRequiredIsarray = 1;
  var toString2 = {}.toString;
  isarray = Array.isArray || function(arr) {
    return toString2.call(arr) == "[object Array]";
  };
  return isarray;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var hasRequiredBuffer;
function requireBuffer() {
  if (hasRequiredBuffer)
    return buffer;
  hasRequiredBuffer = 1;
  (function(exports) {
    var base64 = requireBase64Js();
    var ieee7542 = requireIeee754();
    var isArray2 = requireIsarray();
    exports.Buffer = Buffer;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    Buffer.TYPED_ARRAY_SUPPORT = commonjsGlobal.TYPED_ARRAY_SUPPORT !== void 0 ? commonjsGlobal.TYPED_ARRAY_SUPPORT : typedArraySupport();
    exports.kMaxLength = kMaxLength();
    function typedArraySupport() {
      try {
        var arr = new Uint8Array(1);
        arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
          return 42;
        } };
        return arr.foo() === 42 && typeof arr.subarray === "function" && arr.subarray(1, 1).byteLength === 0;
      } catch (e) {
        return false;
      }
    }
    function kMaxLength() {
      return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }
    function createBuffer(that, length) {
      if (kMaxLength() < length) {
        throw new RangeError("Invalid typed array length");
      }
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        that = new Uint8Array(length);
        that.__proto__ = Buffer.prototype;
      } else {
        if (that === null) {
          that = new Buffer(length);
        }
        that.length = length;
      }
      return that;
    }
    function Buffer(arg, encodingOrOffset, length) {
      if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length);
      }
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new Error(
            "If encoding is specified then the first argument must be a string"
          );
        }
        return allocUnsafe(this, arg);
      }
      return from(this, arg, encodingOrOffset, length);
    }
    Buffer.poolSize = 8192;
    Buffer._augment = function(arr) {
      arr.__proto__ = Buffer.prototype;
      return arr;
    };
    function from(that, value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('"value" argument must not be a number');
      }
      if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length);
      }
      if (typeof value === "string") {
        return fromString(that, value, encodingOrOffset);
      }
      return fromObject(that, value);
    }
    Buffer.from = function(value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length);
    };
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype;
      Buffer.__proto__ = Uint8Array;
      if (typeof Symbol !== "undefined" && Symbol.species && Buffer[Symbol.species] === Buffer) {
        Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
    }
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be a number');
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
      }
    }
    function alloc(that, size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(that, size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
      }
      return createBuffer(that, size);
    }
    Buffer.alloc = function(size, fill, encoding) {
      return alloc(null, size, fill, encoding);
    };
    function allocUnsafe(that, size) {
      assertSize(size);
      that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i2 = 0; i2 < size; ++i2) {
          that[i2] = 0;
        }
      }
      return that;
    }
    Buffer.allocUnsafe = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer.allocUnsafeSlow = function(size) {
      return allocUnsafe(null, size);
    };
    function fromString(that, string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
      }
      var length = byteLength(string, encoding) | 0;
      that = createBuffer(that, length);
      var actual = that.write(string, encoding);
      if (actual !== length) {
        that = that.slice(0, actual);
      }
      return that;
    }
    function fromArrayLike(that, array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      that = createBuffer(that, length);
      for (var i2 = 0; i2 < length; i2 += 1) {
        that[i2] = array[i2] & 255;
      }
      return that;
    }
    function fromArrayBuffer(that, array, byteOffset, length) {
      array.byteLength;
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError("'offset' is out of bounds");
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError("'length' is out of bounds");
      }
      if (byteOffset === void 0 && length === void 0) {
        array = new Uint8Array(array);
      } else if (length === void 0) {
        array = new Uint8Array(array, byteOffset);
      } else {
        array = new Uint8Array(array, byteOffset, length);
      }
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        that = array;
        that.__proto__ = Buffer.prototype;
      } else {
        that = fromArrayLike(that, array);
      }
      return that;
    }
    function fromObject(that, obj) {
      if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        that = createBuffer(that, len);
        if (that.length === 0) {
          return that;
        }
        obj.copy(that, 0, 0, len);
        return that;
      }
      if (obj) {
        if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
          if (typeof obj.length !== "number" || isnan(obj.length)) {
            return createBuffer(that, 0);
          }
          return fromArrayLike(that, obj);
        }
        if (obj.type === "Buffer" && isArray2(obj.data)) {
          return fromArrayLike(that, obj.data);
        }
      }
      throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
    }
    function checked(length) {
      if (length >= kMaxLength()) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer.alloc(+length);
    }
    Buffer.isBuffer = function isBuffer(b) {
      return !!(b != null && b._isBuffer);
    };
    Buffer.compare = function compare(a, b) {
      if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError("Arguments must be Buffers");
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i2 = 0, len = Math.min(x, y); i2 < len; ++i2) {
        if (a[i2] !== b[i2]) {
          x = a[i2];
          y = b[i2];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer.concat = function concat(list, length) {
      if (!isArray2(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer.alloc(0);
      }
      var i2;
      if (length === void 0) {
        length = 0;
        for (i2 = 0; i2 < list.length; ++i2) {
          length += list[i2].length;
        }
      }
      var buffer2 = Buffer.allocUnsafe(length);
      var pos = 0;
      for (i2 = 0; i2 < list.length; ++i2) {
        var buf = list[i2];
        if (!Buffer.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer2, pos);
        pos += buf.length;
      }
      return buffer2;
    };
    function byteLength(string, encoding) {
      if (Buffer.isBuffer(string)) {
        return string.length;
      }
      if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        string = "" + string;
      }
      var len = string.length;
      if (len === 0)
        return 0;
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
          case void 0:
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase)
              return utf8ToBytes(string).length;
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      var loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer.prototype._isBuffer = true;
    function swap(b, n, m) {
      var i2 = b[n];
      b[n] = b[m];
      b[m] = i2;
    }
    Buffer.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i2 = 0; i2 < len; i2 += 2) {
        swap(this, i2, i2 + 1);
      }
      return this;
    };
    Buffer.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i2 = 0; i2 < len; i2 += 4) {
        swap(this, i2, i2 + 3);
        swap(this, i2 + 1, i2 + 2);
      }
      return this;
    };
    Buffer.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i2 = 0; i2 < len; i2 += 8) {
        swap(this, i2, i2 + 7);
        swap(this, i2 + 1, i2 + 6);
        swap(this, i2 + 2, i2 + 5);
        swap(this, i2 + 3, i2 + 4);
      }
      return this;
    };
    Buffer.prototype.toString = function toString2() {
      var length = this.length | 0;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer.prototype.equals = function equals2(b) {
      if (!Buffer.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer.compare(this, b) === 0;
    };
    Buffer.prototype.inspect = function inspect() {
      var str = "";
      var max2 = exports.INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString("hex", 0, max2).match(/.{2}/g).join(" ");
        if (this.length > max2)
          str += " ... ";
      }
      return "<Buffer " + str + ">";
    };
    Buffer.prototype.compare = function compare(target2, start, end, thisStart, thisEnd) {
      if (!Buffer.isBuffer(target2)) {
        throw new TypeError("Argument must be a Buffer");
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target2 ? target2.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target2.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target2)
        return 0;
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target2.slice(start, end);
      for (var i2 = 0; i2 < len; ++i2) {
        if (thisCopy[i2] !== targetCopy[i2]) {
          x = thisCopy[i2];
          y = targetCopy[i2];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (isNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer2.length + byteOffset;
      if (byteOffset >= buffer2.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer2.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer.from(val, encoding);
      }
      if (Buffer.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i3) {
        if (indexSize === 1) {
          return buf[i3];
        } else {
          return buf.readUInt16BE(i3 * indexSize);
        }
      }
      var i2;
      if (dir) {
        var foundIndex = -1;
        for (i2 = byteOffset; i2 < arrLength; i2++) {
          if (read(arr, i2) === read(val, foundIndex === -1 ? 0 : i2 - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i2;
            if (i2 - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i2 -= i2 - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i2 = byteOffset; i2 >= 0; i2--) {
          var found = true;
          for (var j2 = 0; j2 < valLength; j2++) {
            if (read(arr, i2 + j2) !== read(val, j2)) {
              found = false;
              break;
            }
          }
          if (found)
            return i2;
        }
      }
      return -1;
    }
    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      var strLen = string.length;
      if (strLen % 2 !== 0)
        throw new TypeError("Invalid hex string");
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i2 = 0; i2 < length; ++i2) {
        var parsed = parseInt(string.substr(i2 * 2, 2), 16);
        if (isNaN(parsed))
          return i2;
        buf[offset + i2] = parsed;
      }
      return i2;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function latin1Write(buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i2 = start;
      while (i2 < end) {
        var firstByte = buf[i2];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i2 + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i2 + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i2 + 1];
              thirdByte = buf[i2 + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i2 + 1];
              thirdByte = buf[i2 + 2];
              fourthByte = buf[i2 + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i2 += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      var res = "";
      var i2 = 0;
      while (i2 < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i2, i2 += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i2 = start; i2 < end; ++i2) {
        ret += String.fromCharCode(buf[i2] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i2 = start; i2 < end; ++i2) {
        ret += String.fromCharCode(buf[i2]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      var len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      var out = "";
      for (var i2 = start; i2 < end; ++i2) {
        out += toHex(buf[i2]);
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = "";
      for (var i2 = 0; i2 < bytes.length; i2 += 2) {
        res += String.fromCharCode(bytes[i2] + bytes[i2 + 1] * 256);
      }
      return res;
    }
    Buffer.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      var newBuf;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, void 0);
        for (var i2 = 0; i2 < sliceLen; ++i2) {
          newBuf[i2] = this[i2 + start];
        }
      }
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i2 = 0;
      while (++i2 < byteLength2 && (mul *= 256)) {
        val += this[offset + i2] * mul;
      }
      return val;
    };
    Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i2 = 0;
      while (++i2 < byteLength2 && (mul *= 256)) {
        val += this[offset + i2] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i2 = byteLength2;
      var mul = 1;
      var val = this[offset + --i2];
      while (i2 > 0 && (mul *= 256)) {
        val += this[offset + --i2] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee7542.read(this, offset, true, 23, 4);
    };
    Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee7542.read(this, offset, false, 23, 4);
    };
    Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee7542.read(this, offset, true, 52, 8);
    };
    Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee7542.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max2, min2) {
      if (!Buffer.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max2 || value < min2)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i2 = 0;
      this[offset] = value & 255;
      while (++i2 < byteLength2 && (mul *= 256)) {
        this[offset + i2] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i2 = byteLength2 - 1;
      var mul = 1;
      this[offset + i2] = value & 255;
      while (--i2 >= 0 && (mul *= 256)) {
        this[offset + i2] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      this[offset] = value & 255;
      return offset + 1;
    };
    function objectWriteUInt16(buf, value, offset, littleEndian) {
      if (value < 0)
        value = 65535 + value + 1;
      for (var i2 = 0, j2 = Math.min(buf.length - offset, 2); i2 < j2; ++i2) {
        buf[offset + i2] = (value & 255 << 8 * (littleEndian ? i2 : 1 - i2)) >>> (littleEndian ? i2 : 1 - i2) * 8;
      }
    }
    Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    function objectWriteUInt32(buf, value, offset, littleEndian) {
      if (value < 0)
        value = 4294967295 + value + 1;
      for (var i2 = 0, j2 = Math.min(buf.length - offset, 4); i2 < j2; ++i2) {
        buf[offset + i2] = value >>> (littleEndian ? i2 : 3 - i2) * 8 & 255;
      }
    }
    Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i2 = 0;
      var mul = 1;
      var sub2 = 0;
      this[offset] = value & 255;
      while (++i2 < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub2 === 0 && this[offset + i2 - 1] !== 0) {
          sub2 = 1;
        }
        this[offset + i2] = (value / mul >> 0) - sub2 & 255;
      }
      return offset + byteLength2;
    };
    Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i2 = byteLength2 - 1;
      var mul = 1;
      var sub2 = 0;
      this[offset + i2] = value & 255;
      while (--i2 >= 0 && (mul *= 256)) {
        if (value < 0 && sub2 === 0 && this[offset + i2 + 1] !== 0) {
          sub2 = 1;
        }
        this[offset + i2] = (value / mul >> 0) - sub2 & 255;
      }
      return offset + byteLength2;
    };
    Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (!Buffer.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    function checkIEEE754(buf, value, offset, ext, max2, min2) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      ieee7542.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      ieee7542.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer.prototype.copy = function copy2(target2, targetStart, start, end) {
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target2.length)
        targetStart = target2.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target2.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("sourceStart out of bounds");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target2.length - targetStart < end - start) {
        end = target2.length - targetStart + start;
      }
      var len = end - start;
      var i2;
      if (this === target2 && start < targetStart && targetStart < end) {
        for (i2 = len - 1; i2 >= 0; --i2) {
          target2[i2 + targetStart] = this[i2 + start];
        }
      } else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) {
        for (i2 = 0; i2 < len; ++i2) {
          target2[i2 + targetStart] = this[i2 + start];
        }
      } else {
        Uint8Array.prototype.set.call(
          target2,
          this.subarray(start, start + len),
          targetStart
        );
      }
      return len;
    };
    Buffer.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
      } else if (typeof val === "number") {
        val = val & 255;
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      var i2;
      if (typeof val === "number") {
        for (i2 = start; i2 < end; ++i2) {
          this[i2] = val;
        }
      } else {
        var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
        var len = bytes.length;
        for (i2 = 0; i2 < end - start; ++i2) {
          this[i2 + start] = bytes[i2 % len];
        }
      }
      return this;
    };
    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = stringtrim(str).replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function stringtrim(str) {
      if (str.trim)
        return str.trim();
      return str.replace(/^\s+|\s+$/g, "");
    }
    function toHex(n) {
      if (n < 16)
        return "0" + n.toString(16);
      return n.toString(16);
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      for (var i2 = 0; i2 < length; ++i2) {
        codePoint = string.charCodeAt(i2);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i2 + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      var byteArray = [];
      for (var i2 = 0; i2 < str.length; ++i2) {
        byteArray.push(str.charCodeAt(i2) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i2 = 0; i2 < str.length; ++i2) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i2);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      for (var i2 = 0; i2 < length; ++i2) {
        if (i2 + offset >= dst.length || i2 >= src.length)
          break;
        dst[i2 + offset] = src[i2];
      }
      return i2;
    }
    function isnan(val) {
      return val !== val;
    }
  })(buffer);
  return buffer;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var hasRequiredSafeBuffer;
function requireSafeBuffer() {
  if (hasRequiredSafeBuffer)
    return safeBuffer.exports;
  hasRequiredSafeBuffer = 1;
  (function(module, exports) {
    var buffer2 = requireBuffer();
    var Buffer = buffer2.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
      module.exports = buffer2;
    } else {
      copyProps(buffer2, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer.prototype);
    copyProps(Buffer, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer2.SlowBuffer(size);
    };
  })(safeBuffer, safeBuffer.exports);
  return safeBuffer.exports;
}
var hasRequiredString_decoder;
function requireString_decoder() {
  if (hasRequiredString_decoder)
    return string_decoder;
  hasRequiredString_decoder = 1;
  var Buffer = requireSafeBuffer().Buffer;
  var isEncoding = Buffer.isEncoding || function(encoding) {
    encoding = "" + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return true;
      default:
        return false;
    }
  };
  function _normalizeEncoding(enc) {
    if (!enc)
      return "utf8";
    var retried;
    while (true) {
      switch (enc) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return enc;
        default:
          if (retried)
            return;
          enc = ("" + enc).toLowerCase();
          retried = true;
      }
    }
  }
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== "string" && (Buffer.isEncoding === isEncoding || !isEncoding(enc)))
      throw new Error("Unknown encoding: " + enc);
    return nenc || enc;
  }
  string_decoder.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
  }
  StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0)
      return "";
    var r;
    var i2;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === void 0)
        return "";
      i2 = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i2 = 0;
    }
    if (i2 < buf.length)
      return r ? r + this.text(buf, i2) : this.text(buf, i2);
    return r || "";
  };
  StringDecoder.prototype.end = utf8End;
  StringDecoder.prototype.text = utf8Text;
  StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  function utf8CheckByte(byte) {
    if (byte <= 127)
      return 0;
    else if (byte >> 5 === 6)
      return 2;
    else if (byte >> 4 === 14)
      return 3;
    else if (byte >> 3 === 30)
      return 4;
    return byte >> 6 === 2 ? -1 : -2;
  }
  function utf8CheckIncomplete(self2, buf, i2) {
    var j2 = buf.length - 1;
    if (j2 < i2)
      return 0;
    var nb = utf8CheckByte(buf[j2]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 1;
      return nb;
    }
    if (--j2 < i2 || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j2]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 2;
      return nb;
    }
    if (--j2 < i2 || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j2]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2)
          nb = 0;
        else
          self2.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  function utf8CheckExtraBytes(self2, buf, p) {
    if ((buf[0] & 192) !== 128) {
      self2.lastNeed = 0;
      return "\uFFFD";
    }
    if (self2.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 192) !== 128) {
        self2.lastNeed = 1;
        return "\uFFFD";
      }
      if (self2.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 192) !== 128) {
          self2.lastNeed = 2;
          return "\uFFFD";
        }
      }
    }
  }
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf);
    if (r !== void 0)
      return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  function utf8Text(buf, i2) {
    var total = utf8CheckIncomplete(this, buf, i2);
    if (!this.lastNeed)
      return buf.toString("utf8", i2);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i2, end);
  }
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + "\uFFFD";
    return r;
  }
  function utf16Text(buf, i2) {
    if ((buf.length - i2) % 2 === 0) {
      var r = buf.toString("utf16le", i2);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 55296 && c <= 56319) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString("utf16le", i2, buf.length - 1);
  }
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString("utf16le", 0, end);
    }
    return r;
  }
  function base64Text(buf, i2) {
    var n = (buf.length - i2) % 3;
    if (n === 0)
      return buf.toString("base64", i2);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i2, buf.length - n);
  }
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    return r;
  }
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
  }
  return string_decoder;
}
var WritableStream_1;
var hasRequiredWritableStream;
function requireWritableStream() {
  if (hasRequiredWritableStream)
    return WritableStream_1;
  hasRequiredWritableStream = 1;
  WritableStream_1 = Stream;
  var Parser2 = Parser_1;
  var WritableStream = require$$1$3.Writable;
  var StringDecoder = requireString_decoder().StringDecoder;
  var Buffer = requireBuffer().Buffer;
  function Stream(cbs, options) {
    var parser = this._parser = new Parser2(cbs, options);
    var decoder = this._decoder = new StringDecoder();
    WritableStream.call(this, { decodeStrings: false });
    this.once("finish", function() {
      parser.end(decoder.end());
    });
  }
  inherits_browser.exports(Stream, WritableStream);
  Stream.prototype._write = function(chunk, encoding, cb) {
    if (chunk instanceof Buffer)
      chunk = this._decoder.write(chunk);
    this._parser.write(chunk);
    cb();
  };
  return WritableStream_1;
}
var Stream_1;
var hasRequiredStream;
function requireStream() {
  if (hasRequiredStream)
    return Stream_1;
  hasRequiredStream = 1;
  Stream_1 = Stream;
  var Parser2 = requireWritableStream();
  function Stream(options) {
    Parser2.call(this, new Cbs(this), options);
  }
  inherits_browser.exports(Stream, Parser2);
  Stream.prototype.readable = true;
  function Cbs(scope) {
    this.scope = scope;
  }
  var EVENTS = requireLib().EVENTS;
  Object.keys(EVENTS).forEach(function(name) {
    if (EVENTS[name] === 0) {
      Cbs.prototype["on" + name] = function() {
        this.scope.emit(name);
      };
    } else if (EVENTS[name] === 1) {
      Cbs.prototype["on" + name] = function(a) {
        this.scope.emit(name, a);
      };
    } else if (EVENTS[name] === 2) {
      Cbs.prototype["on" + name] = function(a, b) {
        this.scope.emit(name, a, b);
      };
    } else {
      throw Error("wrong number of arguments!");
    }
  });
  return Stream_1;
}
var ProxyHandler_1;
var hasRequiredProxyHandler;
function requireProxyHandler() {
  if (hasRequiredProxyHandler)
    return ProxyHandler_1;
  hasRequiredProxyHandler = 1;
  ProxyHandler_1 = ProxyHandler;
  function ProxyHandler(cbs) {
    this._cbs = cbs || {};
  }
  var EVENTS = requireLib().EVENTS;
  Object.keys(EVENTS).forEach(function(name) {
    if (EVENTS[name] === 0) {
      name = "on" + name;
      ProxyHandler.prototype[name] = function() {
        if (this._cbs[name])
          this._cbs[name]();
      };
    } else if (EVENTS[name] === 1) {
      name = "on" + name;
      ProxyHandler.prototype[name] = function(a) {
        if (this._cbs[name])
          this._cbs[name](a);
      };
    } else if (EVENTS[name] === 2) {
      name = "on" + name;
      ProxyHandler.prototype[name] = function(a, b) {
        if (this._cbs[name])
          this._cbs[name](a, b);
      };
    } else {
      throw Error("wrong number of arguments");
    }
  });
  return ProxyHandler_1;
}
var CollectingHandler_1;
var hasRequiredCollectingHandler;
function requireCollectingHandler() {
  if (hasRequiredCollectingHandler)
    return CollectingHandler_1;
  hasRequiredCollectingHandler = 1;
  CollectingHandler_1 = CollectingHandler;
  function CollectingHandler(cbs) {
    this._cbs = cbs || {};
    this.events = [];
  }
  var EVENTS = requireLib().EVENTS;
  Object.keys(EVENTS).forEach(function(name) {
    if (EVENTS[name] === 0) {
      name = "on" + name;
      CollectingHandler.prototype[name] = function() {
        this.events.push([name]);
        if (this._cbs[name])
          this._cbs[name]();
      };
    } else if (EVENTS[name] === 1) {
      name = "on" + name;
      CollectingHandler.prototype[name] = function(a) {
        this.events.push([name, a]);
        if (this._cbs[name])
          this._cbs[name](a);
      };
    } else if (EVENTS[name] === 2) {
      name = "on" + name;
      CollectingHandler.prototype[name] = function(a, b) {
        this.events.push([name, a, b]);
        if (this._cbs[name])
          this._cbs[name](a, b);
      };
    } else {
      throw Error("wrong number of arguments");
    }
  });
  CollectingHandler.prototype.onreset = function() {
    this.events = [];
    if (this._cbs.onreset)
      this._cbs.onreset();
  };
  CollectingHandler.prototype.restart = function() {
    if (this._cbs.onreset)
      this._cbs.onreset();
    for (var i2 = 0, len = this.events.length; i2 < len; i2++) {
      if (this._cbs[this.events[i2][0]]) {
        var num2 = this.events[i2].length;
        if (num2 === 1) {
          this._cbs[this.events[i2][0]]();
        } else if (num2 === 2) {
          this._cbs[this.events[i2][0]](this.events[i2][1]);
        } else {
          this._cbs[this.events[i2][0]](
            this.events[i2][1],
            this.events[i2][2]
          );
        }
      }
    }
  };
  return CollectingHandler_1;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib)
    return lib$2.exports;
  hasRequiredLib = 1;
  (function(module) {
    var Parser2 = Parser_1;
    var DomHandler2 = domhandler;
    function defineProp(name, value) {
      delete module.exports[name];
      module.exports[name] = value;
      return value;
    }
    module.exports = {
      Parser: Parser2,
      Tokenizer: Tokenizer_1,
      ElementType: domelementtype,
      DomHandler: DomHandler2,
      get FeedHandler() {
        return defineProp("FeedHandler", requireFeedHandler());
      },
      get Stream() {
        return defineProp("Stream", requireStream());
      },
      get WritableStream() {
        return defineProp("WritableStream", requireWritableStream());
      },
      get ProxyHandler() {
        return defineProp("ProxyHandler", requireProxyHandler());
      },
      get DomUtils() {
        return defineProp("DomUtils", requireDomutils());
      },
      get CollectingHandler() {
        return defineProp(
          "CollectingHandler",
          requireCollectingHandler()
        );
      },
      DefaultHandler: DomHandler2,
      get RssHandler() {
        return defineProp("RssHandler", this.FeedHandler);
      },
      parseDOM: function(data, options) {
        var handler = new DomHandler2(options);
        new Parser2(handler, options).end(data);
        return handler.dom;
      },
      parseFeed: function(feed, options) {
        var handler = new module.exports.FeedHandler(options);
        new Parser2(handler, options).end(feed);
        return handler.dom;
      },
      createDomStream: function(cb, options, elementCb) {
        var handler = new DomHandler2(cb, options, elementCb);
        return new Parser2(handler, options);
      },
      EVENTS: {
        attribute: 2,
        cdatastart: 0,
        cdataend: 0,
        text: 1,
        processinginstruction: 2,
        comment: 1,
        commentend: 0,
        closetag: 1,
        opentag: 2,
        opentagname: 1,
        error: 1,
        end: 0
      }
    };
  })(lib$2);
  return lib$2.exports;
}
var htmlparser = requireLib();
var parseHTML$1 = function parseHTML(html) {
  var handler = new htmlparser.DomHandler();
  var parser = new htmlparser.Parser(handler, {
    lowerCaseAttributeNames: false
  });
  parser.parseComplete(html);
  return handler.dom;
};
var parseHtml = parseHTML$1;
var createConverter2 = htmlparserToVdom;
var parseHTML2 = parseHtml;
var htmlToVdom$1 = function initializeHtmlToVdom(VTree, VText2) {
  var htmlparserToVdom2 = createConverter2(VTree, VText2);
  return function convertHTML2(options, html) {
    var noOptions = typeof html === "undefined" && typeof options === "string";
    var hasOptions = !noOptions;
    var htmlToConvert = noOptions ? options : html;
    var getVNodeKey = hasOptions ? options.getVNodeKey : void 0;
    var tags = parseHTML2(htmlToConvert);
    var convertedHTML;
    if (tags.length > 1) {
      convertedHTML = tags.map(function(tag) {
        return htmlparserToVdom2.convert(tag, getVNodeKey);
      });
    } else {
      convertedHTML = htmlparserToVdom2.convert(tags[0], getVNodeKey);
    }
    return convertedHTML;
  };
};
var convertHTML$1 = htmlToVdom$1;
var htmlToVdom = function initializeConverter(dependencies) {
  if (!dependencies.VNode || !dependencies.VText) {
    throw new Error("html-to-vdom needs to be initialized with VNode and VText");
  }
  return convertHTML$1(dependencies.VNode, dependencies.VText);
};
var jquery = { exports: {} };
/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
(function(module) {
  (function(global2, factory) {
    {
      module.exports = global2.document ? factory(global2, true) : function(w) {
        if (!w.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return factory(w);
      };
    }
  })(typeof window !== "undefined" ? window : commonjsGlobal, function(window2, noGlobal) {
    var arr = [];
    var getProto2 = Object.getPrototypeOf;
    var slice = arr.slice;
    var flat2 = arr.flat ? function(array) {
      return arr.flat.call(array);
    } : function(array) {
      return arr.concat.apply([], array);
    };
    var push = arr.push;
    var indexOf = arr.indexOf;
    var class2type = {};
    var toString2 = class2type.toString;
    var hasOwn2 = class2type.hasOwnProperty;
    var fnToString = hasOwn2.toString;
    var ObjectFunctionString = fnToString.call(Object);
    var support = {};
    var isFunction = function isFunction2(obj) {
      return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
    };
    var isWindow = function isWindow2(obj) {
      return obj != null && obj === obj.window;
    };
    var document2 = window2.document;
    var preservedScriptAttributes = {
      type: true,
      src: true,
      nonce: true,
      noModule: true
    };
    function DOMEval(code, node2, doc) {
      doc = doc || document2;
      var i2, val, script = doc.createElement("script");
      script.text = code;
      if (node2) {
        for (i2 in preservedScriptAttributes) {
          val = node2[i2] || node2.getAttribute && node2.getAttribute(i2);
          if (val) {
            script.setAttribute(i2, val);
          }
        }
      }
      doc.head.appendChild(script).parentNode.removeChild(script);
    }
    function toType(obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ? class2type[toString2.call(obj)] || "object" : typeof obj;
    }
    var version2 = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery2 = function(selector, context) {
      return new jQuery2.fn.init(selector, context);
    };
    jQuery2.fn = jQuery2.prototype = {
      jquery: version2,
      constructor: jQuery2,
      length: 0,
      toArray: function() {
        return slice.call(this);
      },
      get: function(num2) {
        if (num2 == null) {
          return slice.call(this);
        }
        return num2 < 0 ? this[num2 + this.length] : this[num2];
      },
      pushStack: function(elems) {
        var ret = jQuery2.merge(this.constructor(), elems);
        ret.prevObject = this;
        return ret;
      },
      each: function(callback) {
        return jQuery2.each(this, callback);
      },
      map: function(callback) {
        return this.pushStack(jQuery2.map(this, function(elem, i2) {
          return callback.call(elem, i2, elem);
        }));
      },
      slice: function() {
        return this.pushStack(slice.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      even: function() {
        return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
          return (i2 + 1) % 2;
        }));
      },
      odd: function() {
        return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
          return i2 % 2;
        }));
      },
      eq: function(i2) {
        var len = this.length, j2 = +i2 + (i2 < 0 ? len : 0);
        return this.pushStack(j2 >= 0 && j2 < len ? [this[j2]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      push,
      sort: arr.sort,
      splice: arr.splice
    };
    jQuery2.extend = jQuery2.fn.extend = function() {
      var options, name, src, copy2, copyIsArray, clone, target2 = arguments[0] || {}, i2 = 1, length = arguments.length, deep = false;
      if (typeof target2 === "boolean") {
        deep = target2;
        target2 = arguments[i2] || {};
        i2++;
      }
      if (typeof target2 !== "object" && !isFunction(target2)) {
        target2 = {};
      }
      if (i2 === length) {
        target2 = this;
        i2--;
      }
      for (; i2 < length; i2++) {
        if ((options = arguments[i2]) != null) {
          for (name in options) {
            copy2 = options[name];
            if (name === "__proto__" || target2 === copy2) {
              continue;
            }
            if (deep && copy2 && (jQuery2.isPlainObject(copy2) || (copyIsArray = Array.isArray(copy2)))) {
              src = target2[name];
              if (copyIsArray && !Array.isArray(src)) {
                clone = [];
              } else if (!copyIsArray && !jQuery2.isPlainObject(src)) {
                clone = {};
              } else {
                clone = src;
              }
              copyIsArray = false;
              target2[name] = jQuery2.extend(deep, clone, copy2);
            } else if (copy2 !== void 0) {
              target2[name] = copy2;
            }
          }
        }
      }
      return target2;
    };
    jQuery2.extend({
      expando: "jQuery" + (version2 + Math.random()).replace(/\D/g, ""),
      isReady: true,
      error: function(msg) {
        throw new Error(msg);
      },
      noop: function() {
      },
      isPlainObject: function(obj) {
        var proto, Ctor;
        if (!obj || toString2.call(obj) !== "[object Object]") {
          return false;
        }
        proto = getProto2(obj);
        if (!proto) {
          return true;
        }
        Ctor = hasOwn2.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
      },
      isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
          return false;
        }
        return true;
      },
      globalEval: function(code, options, doc) {
        DOMEval(code, { nonce: options && options.nonce }, doc);
      },
      each: function(obj, callback) {
        var length, i2 = 0;
        if (isArrayLike(obj)) {
          length = obj.length;
          for (; i2 < length; i2++) {
            if (callback.call(obj[i2], i2, obj[i2]) === false) {
              break;
            }
          }
        } else {
          for (i2 in obj) {
            if (callback.call(obj[i2], i2, obj[i2]) === false) {
              break;
            }
          }
        }
        return obj;
      },
      text: function(elem) {
        var node2, ret = "", i2 = 0, nodeType = elem.nodeType;
        if (!nodeType) {
          while (node2 = elem[i2++]) {
            ret += jQuery2.text(node2);
          }
        }
        if (nodeType === 1 || nodeType === 11) {
          return elem.textContent;
        }
        if (nodeType === 9) {
          return elem.documentElement.textContent;
        }
        if (nodeType === 3 || nodeType === 4) {
          return elem.nodeValue;
        }
        return ret;
      },
      makeArray: function(arr2, results) {
        var ret = results || [];
        if (arr2 != null) {
          if (isArrayLike(Object(arr2))) {
            jQuery2.merge(
              ret,
              typeof arr2 === "string" ? [arr2] : arr2
            );
          } else {
            push.call(ret, arr2);
          }
        }
        return ret;
      },
      inArray: function(elem, arr2, i2) {
        return arr2 == null ? -1 : indexOf.call(arr2, elem, i2);
      },
      isXMLDoc: function(elem) {
        var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
        return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
      },
      merge: function(first, second) {
        var len = +second.length, j2 = 0, i2 = first.length;
        for (; j2 < len; j2++) {
          first[i2++] = second[j2];
        }
        first.length = i2;
        return first;
      },
      grep: function(elems, callback, invert) {
        var callbackInverse, matches = [], i2 = 0, length = elems.length, callbackExpect = !invert;
        for (; i2 < length; i2++) {
          callbackInverse = !callback(elems[i2], i2);
          if (callbackInverse !== callbackExpect) {
            matches.push(elems[i2]);
          }
        }
        return matches;
      },
      map: function(elems, callback, arg) {
        var length, value, i2 = 0, ret = [];
        if (isArrayLike(elems)) {
          length = elems.length;
          for (; i2 < length; i2++) {
            value = callback(elems[i2], i2, arg);
            if (value != null) {
              ret.push(value);
            }
          }
        } else {
          for (i2 in elems) {
            value = callback(elems[i2], i2, arg);
            if (value != null) {
              ret.push(value);
            }
          }
        }
        return flat2(ret);
      },
      guid: 1,
      support
    });
    if (typeof Symbol === "function") {
      jQuery2.fn[Symbol.iterator] = arr[Symbol.iterator];
    }
    jQuery2.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(_i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
      }
    );
    function isArrayLike(obj) {
      var length = !!obj && "length" in obj && obj.length, type2 = toType(obj);
      if (isFunction(obj) || isWindow(obj)) {
        return false;
      }
      return type2 === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
    }
    function nodeName(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }
    var pop = arr.pop;
    var sort = arr.sort;
    var splice = arr.splice;
    var whitespace2 = "[\\x20\\t\\r\\n\\f]";
    var rtrimCSS = new RegExp(
      "^" + whitespace2 + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace2 + "+$",
      "g"
    );
    jQuery2.contains = function(a, b) {
      var bup = b && b.parentNode;
      return a === bup || !!(bup && bup.nodeType === 1 && (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
    };
    var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
    function fcssescape(ch, asCodePoint) {
      if (asCodePoint) {
        if (ch === "\0") {
          return "\uFFFD";
        }
        return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
      }
      return "\\" + ch;
    }
    jQuery2.escapeSelector = function(sel) {
      return (sel + "").replace(rcssescape, fcssescape);
    };
    var preferredDoc = document2, pushNative = push;
    (function() {
      var i2, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery2.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
        if (a === b) {
          hasDuplicate = true;
        }
        return 0;
      }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace2 + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace2 + "*(" + identifier + ")(?:" + whitespace2 + "*([*^$|!~]?=)" + whitespace2 + `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace2 + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace2 + "+", "g"), rcomma = new RegExp("^" + whitespace2 + "*," + whitespace2 + "*"), rleadingCombinator = new RegExp("^" + whitespace2 + "*([>+~]|" + whitespace2 + ")" + whitespace2 + "*"), rdescend = new RegExp(whitespace2 + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
        ID: new RegExp("^#(" + identifier + ")"),
        CLASS: new RegExp("^\\.(" + identifier + ")"),
        TAG: new RegExp("^(" + identifier + "|[*])"),
        ATTR: new RegExp("^" + attributes),
        PSEUDO: new RegExp("^" + pseudos),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace2 + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace2 + "*(?:([+-]|)" + whitespace2 + "*(\\d+)|))" + whitespace2 + "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + booleans + ")$", "i"),
        needsContext: new RegExp("^" + whitespace2 + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace2 + "*((?:-\\d)?\\d*)" + whitespace2 + "*\\)|)(?=[^-]|$)", "i")
      }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace2 + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
        var high = "0x" + escape.slice(1) - 65536;
        if (nonHex) {
          return nonHex;
        }
        return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
      }, unloadHandler = function() {
        setDocument();
      }, inDisabledFieldset = addCombinator(
        function(elem) {
          return elem.disabled === true && nodeName(elem, "fieldset");
        },
        { dir: "parentNode", next: "legend" }
      );
      function safeActiveElement() {
        try {
          return document3.activeElement;
        } catch (err) {
        }
      }
      try {
        push2.apply(
          arr = slice.call(preferredDoc.childNodes),
          preferredDoc.childNodes
        );
        arr[preferredDoc.childNodes.length].nodeType;
      } catch (e) {
        push2 = {
          apply: function(target2, els2) {
            pushNative.apply(target2, slice.call(els2));
          },
          call: function(target2) {
            pushNative.apply(target2, slice.call(arguments, 1));
          }
        };
      }
      function find(selector, context, results, seed) {
        var m, i3, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
        results = results || [];
        if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
          return results;
        }
        if (!seed) {
          setDocument(context);
          context = context || document3;
          if (documentIsHTML) {
            if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
              if (m = match[1]) {
                if (nodeType === 9) {
                  if (elem = context.getElementById(m)) {
                    if (elem.id === m) {
                      push2.call(results, elem);
                      return results;
                    }
                  } else {
                    return results;
                  }
                } else {
                  if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                    push2.call(results, elem);
                    return results;
                  }
                }
              } else if (match[2]) {
                push2.apply(results, context.getElementsByTagName(selector));
                return results;
              } else if ((m = match[3]) && context.getElementsByClassName) {
                push2.apply(results, context.getElementsByClassName(m));
                return results;
              }
            }
            if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
              newSelector = selector;
              newContext = context;
              if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                if (newContext != context || !support.scope) {
                  if (nid = context.getAttribute("id")) {
                    nid = jQuery2.escapeSelector(nid);
                  } else {
                    context.setAttribute("id", nid = expando);
                  }
                }
                groups = tokenize(selector);
                i3 = groups.length;
                while (i3--) {
                  groups[i3] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i3]);
                }
                newSelector = groups.join(",");
              }
              try {
                push2.apply(
                  results,
                  newContext.querySelectorAll(newSelector)
                );
                return results;
              } catch (qsaError) {
                nonnativeSelectorCache(selector, true);
              } finally {
                if (nid === expando) {
                  context.removeAttribute("id");
                }
              }
            }
          }
        }
        return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
      }
      function createCache() {
        var keys = [];
        function cache(key, value) {
          if (keys.push(key + " ") > Expr.cacheLength) {
            delete cache[keys.shift()];
          }
          return cache[key + " "] = value;
        }
        return cache;
      }
      function markFunction(fn2) {
        fn2[expando] = true;
        return fn2;
      }
      function assert(fn2) {
        var el2 = document3.createElement("fieldset");
        try {
          return !!fn2(el2);
        } catch (e) {
          return false;
        } finally {
          if (el2.parentNode) {
            el2.parentNode.removeChild(el2);
          }
          el2 = null;
        }
      }
      function createInputPseudo(type2) {
        return function(elem) {
          return nodeName(elem, "input") && elem.type === type2;
        };
      }
      function createButtonPseudo(type2) {
        return function(elem) {
          return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type2;
        };
      }
      function createDisabledPseudo(disabled) {
        return function(elem) {
          if ("form" in elem) {
            if (elem.parentNode && elem.disabled === false) {
              if ("label" in elem) {
                if ("label" in elem.parentNode) {
                  return elem.parentNode.disabled === disabled;
                } else {
                  return elem.disabled === disabled;
                }
              }
              return elem.isDisabled === disabled || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
            }
            return elem.disabled === disabled;
          } else if ("label" in elem) {
            return elem.disabled === disabled;
          }
          return false;
        };
      }
      function createPositionalPseudo(fn2) {
        return markFunction(function(argument) {
          argument = +argument;
          return markFunction(function(seed, matches2) {
            var j2, matchIndexes = fn2([], seed.length, argument), i3 = matchIndexes.length;
            while (i3--) {
              if (seed[j2 = matchIndexes[i3]]) {
                seed[j2] = !(matches2[j2] = seed[j2]);
              }
            }
          });
        });
      }
      function testContext(context) {
        return context && typeof context.getElementsByTagName !== "undefined" && context;
      }
      function setDocument(node2) {
        var subWindow, doc = node2 ? node2.ownerDocument || node2 : preferredDoc;
        if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
          return document3;
        }
        document3 = doc;
        documentElement2 = document3.documentElement;
        documentIsHTML = !jQuery2.isXMLDoc(document3);
        matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
        if (documentElement2.msMatchesSelector && preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
          subWindow.addEventListener("unload", unloadHandler);
        }
        support.getById = assert(function(el2) {
          documentElement2.appendChild(el2).id = jQuery2.expando;
          return !document3.getElementsByName || !document3.getElementsByName(jQuery2.expando).length;
        });
        support.disconnectedMatch = assert(function(el2) {
          return matches.call(el2, "*");
        });
        support.scope = assert(function() {
          return document3.querySelectorAll(":scope");
        });
        support.cssHas = assert(function() {
          try {
            document3.querySelector(":has(*,:jqfake)");
            return false;
          } catch (e) {
            return true;
          }
        });
        if (support.getById) {
          Expr.filter.ID = function(id) {
            var attrId = id.replace(runescape, funescape);
            return function(elem) {
              return elem.getAttribute("id") === attrId;
            };
          };
          Expr.find.ID = function(id, context) {
            if (typeof context.getElementById !== "undefined" && documentIsHTML) {
              var elem = context.getElementById(id);
              return elem ? [elem] : [];
            }
          };
        } else {
          Expr.filter.ID = function(id) {
            var attrId = id.replace(runescape, funescape);
            return function(elem) {
              var node3 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
              return node3 && node3.value === attrId;
            };
          };
          Expr.find.ID = function(id, context) {
            if (typeof context.getElementById !== "undefined" && documentIsHTML) {
              var node3, i3, elems, elem = context.getElementById(id);
              if (elem) {
                node3 = elem.getAttributeNode("id");
                if (node3 && node3.value === id) {
                  return [elem];
                }
                elems = context.getElementsByName(id);
                i3 = 0;
                while (elem = elems[i3++]) {
                  node3 = elem.getAttributeNode("id");
                  if (node3 && node3.value === id) {
                    return [elem];
                  }
                }
              }
              return [];
            }
          };
        }
        Expr.find.TAG = function(tag, context) {
          if (typeof context.getElementsByTagName !== "undefined") {
            return context.getElementsByTagName(tag);
          } else {
            return context.querySelectorAll(tag);
          }
        };
        Expr.find.CLASS = function(className, context) {
          if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
            return context.getElementsByClassName(className);
          }
        };
        rbuggyQSA = [];
        assert(function(el2) {
          var input;
          documentElement2.appendChild(el2).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
          if (!el2.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace2 + "*(?:value|" + booleans + ")");
          }
          if (!el2.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          }
          if (!el2.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
          if (!el2.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          }
          input = document3.createElement("input");
          input.setAttribute("type", "hidden");
          el2.appendChild(input).setAttribute("name", "D");
          documentElement2.appendChild(el2).disabled = true;
          if (el2.querySelectorAll(":disabled").length !== 2) {
            rbuggyQSA.push(":enabled", ":disabled");
          }
          input = document3.createElement("input");
          input.setAttribute("name", "");
          el2.appendChild(input);
          if (!el2.querySelectorAll("[name='']").length) {
            rbuggyQSA.push("\\[" + whitespace2 + "*name" + whitespace2 + "*=" + whitespace2 + `*(?:''|"")`);
          }
        });
        if (!support.cssHas) {
          rbuggyQSA.push(":has");
        }
        rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
        sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
            return 0;
          }
          var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
          if (compare) {
            return compare;
          }
          compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
          if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
            if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
              return -1;
            }
            if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
              return 1;
            }
            return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
          }
          return compare & 4 ? -1 : 1;
        };
        return document3;
      }
      find.matches = function(expr, elements) {
        return find(expr, null, null, elements);
      };
      find.matchesSelector = function(elem, expr) {
        setDocument(elem);
        if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
          try {
            var ret = matches.call(elem, expr);
            if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
              return ret;
            }
          } catch (e) {
            nonnativeSelectorCache(expr, true);
          }
        }
        return find(expr, document3, null, [elem]).length > 0;
      };
      find.contains = function(context, elem) {
        if ((context.ownerDocument || context) != document3) {
          setDocument(context);
        }
        return jQuery2.contains(context, elem);
      };
      find.attr = function(elem, name) {
        if ((elem.ownerDocument || elem) != document3) {
          setDocument(elem);
        }
        var fn2 = Expr.attrHandle[name.toLowerCase()], val = fn2 && hasOwn2.call(Expr.attrHandle, name.toLowerCase()) ? fn2(elem, name, !documentIsHTML) : void 0;
        if (val !== void 0) {
          return val;
        }
        return elem.getAttribute(name);
      };
      find.error = function(msg) {
        throw new Error("Syntax error, unrecognized expression: " + msg);
      };
      jQuery2.uniqueSort = function(results) {
        var elem, duplicates = [], j2 = 0, i3 = 0;
        hasDuplicate = !support.sortStable;
        sortInput = !support.sortStable && slice.call(results, 0);
        sort.call(results, sortOrder);
        if (hasDuplicate) {
          while (elem = results[i3++]) {
            if (elem === results[i3]) {
              j2 = duplicates.push(i3);
            }
          }
          while (j2--) {
            splice.call(results, duplicates[j2], 1);
          }
        }
        sortInput = null;
        return results;
      };
      jQuery2.fn.uniqueSort = function() {
        return this.pushStack(jQuery2.uniqueSort(slice.apply(this)));
      };
      Expr = jQuery2.expr = {
        cacheLength: 50,
        createPseudo: markFunction,
        match: matchExpr,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: true },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: true },
          "~": { dir: "previousSibling" }
        },
        preFilter: {
          ATTR: function(match) {
            match[1] = match[1].replace(runescape, funescape);
            match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
            if (match[2] === "~=") {
              match[3] = " " + match[3] + " ";
            }
            return match.slice(0, 4);
          },
          CHILD: function(match) {
            match[1] = match[1].toLowerCase();
            if (match[1].slice(0, 3) === "nth") {
              if (!match[3]) {
                find.error(match[0]);
              }
              match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
              match[5] = +(match[7] + match[8] || match[3] === "odd");
            } else if (match[3]) {
              find.error(match[0]);
            }
            return match;
          },
          PSEUDO: function(match) {
            var excess, unquoted = !match[6] && match[2];
            if (matchExpr.CHILD.test(match[0])) {
              return null;
            }
            if (match[3]) {
              match[2] = match[4] || match[5] || "";
            } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
              match[0] = match[0].slice(0, excess);
              match[2] = unquoted.slice(0, excess);
            }
            return match.slice(0, 3);
          }
        },
        filter: {
          TAG: function(nodeNameSelector) {
            var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
            return nodeNameSelector === "*" ? function() {
              return true;
            } : function(elem) {
              return nodeName(elem, expectedNodeName);
            };
          },
          CLASS: function(className) {
            var pattern = classCache[className + " "];
            return pattern || (pattern = new RegExp("(^|" + whitespace2 + ")" + className + "(" + whitespace2 + "|$)")) && classCache(className, function(elem) {
              return pattern.test(
                typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
              );
            });
          },
          ATTR: function(name, operator, check2) {
            return function(elem) {
              var result = find.attr(elem, name);
              if (result == null) {
                return operator === "!=";
              }
              if (!operator) {
                return true;
              }
              result += "";
              if (operator === "=") {
                return result === check2;
              }
              if (operator === "!=") {
                return result !== check2;
              }
              if (operator === "^=") {
                return check2 && result.indexOf(check2) === 0;
              }
              if (operator === "*=") {
                return check2 && result.indexOf(check2) > -1;
              }
              if (operator === "$=") {
                return check2 && result.slice(-check2.length) === check2;
              }
              if (operator === "~=") {
                return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check2) > -1;
              }
              if (operator === "|=") {
                return result === check2 || result.slice(0, check2.length + 1) === check2 + "-";
              }
              return false;
            };
          },
          CHILD: function(type2, what, _argument, first, last) {
            var simple = type2.slice(0, 3) !== "nth", forward = type2.slice(-4) !== "last", ofType = what === "of-type";
            return first === 1 && last === 0 ? function(elem) {
              return !!elem.parentNode;
            } : function(elem, _context, xml) {
              var cache, outerCache, node2, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff2 = false;
              if (parent) {
                if (simple) {
                  while (dir2) {
                    node2 = elem;
                    while (node2 = node2[dir2]) {
                      if (ofType ? nodeName(node2, name) : node2.nodeType === 1) {
                        return false;
                      }
                    }
                    start = dir2 = type2 === "only" && !start && "nextSibling";
                  }
                  return true;
                }
                start = [forward ? parent.firstChild : parent.lastChild];
                if (forward && useCache) {
                  outerCache = parent[expando] || (parent[expando] = {});
                  cache = outerCache[type2] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff2 = nodeIndex && cache[2];
                  node2 = nodeIndex && parent.childNodes[nodeIndex];
                  while (node2 = ++nodeIndex && node2 && node2[dir2] || (diff2 = nodeIndex = 0) || start.pop()) {
                    if (node2.nodeType === 1 && ++diff2 && node2 === elem) {
                      outerCache[type2] = [dirruns, nodeIndex, diff2];
                      break;
                    }
                  }
                } else {
                  if (useCache) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    cache = outerCache[type2] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff2 = nodeIndex;
                  }
                  if (diff2 === false) {
                    while (node2 = ++nodeIndex && node2 && node2[dir2] || (diff2 = nodeIndex = 0) || start.pop()) {
                      if ((ofType ? nodeName(node2, name) : node2.nodeType === 1) && ++diff2) {
                        if (useCache) {
                          outerCache = node2[expando] || (node2[expando] = {});
                          outerCache[type2] = [dirruns, diff2];
                        }
                        if (node2 === elem) {
                          break;
                        }
                      }
                    }
                  }
                }
                diff2 -= last;
                return diff2 === first || diff2 % first === 0 && diff2 / first >= 0;
              }
            };
          },
          PSEUDO: function(pseudo, argument) {
            var args, fn2 = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
            if (fn2[expando]) {
              return fn2(argument);
            }
            if (fn2.length > 1) {
              args = [pseudo, pseudo, "", argument];
              return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                var idx, matched = fn2(seed, argument), i3 = matched.length;
                while (i3--) {
                  idx = indexOf.call(seed, matched[i3]);
                  seed[idx] = !(matches2[idx] = matched[i3]);
                }
              }) : function(elem) {
                return fn2(elem, 0, args);
              };
            }
            return fn2;
          }
        },
        pseudos: {
          not: markFunction(function(selector) {
            var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
            return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
              var elem, unmatched = matcher(seed, null, xml, []), i3 = seed.length;
              while (i3--) {
                if (elem = unmatched[i3]) {
                  seed[i3] = !(matches2[i3] = elem);
                }
              }
            }) : function(elem, _context, xml) {
              input[0] = elem;
              matcher(input, null, xml, results);
              input[0] = null;
              return !results.pop();
            };
          }),
          has: markFunction(function(selector) {
            return function(elem) {
              return find(selector, elem).length > 0;
            };
          }),
          contains: markFunction(function(text) {
            text = text.replace(runescape, funescape);
            return function(elem) {
              return (elem.textContent || jQuery2.text(elem)).indexOf(text) > -1;
            };
          }),
          lang: markFunction(function(lang2) {
            if (!ridentifier.test(lang2 || "")) {
              find.error("unsupported lang: " + lang2);
            }
            lang2 = lang2.replace(runescape, funescape).toLowerCase();
            return function(elem) {
              var elemLang;
              do {
                if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                  elemLang = elemLang.toLowerCase();
                  return elemLang === lang2 || elemLang.indexOf(lang2 + "-") === 0;
                }
              } while ((elem = elem.parentNode) && elem.nodeType === 1);
              return false;
            };
          }),
          target: function(elem) {
            var hash = window2.location && window2.location.hash;
            return hash && hash.slice(1) === elem.id;
          },
          root: function(elem) {
            return elem === documentElement2;
          },
          focus: function(elem) {
            return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
          },
          enabled: createDisabledPseudo(false),
          disabled: createDisabledPseudo(true),
          checked: function(elem) {
            return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
          },
          selected: function(elem) {
            if (elem.parentNode) {
              elem.parentNode.selectedIndex;
            }
            return elem.selected === true;
          },
          empty: function(elem) {
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
              if (elem.nodeType < 6) {
                return false;
              }
            }
            return true;
          },
          parent: function(elem) {
            return !Expr.pseudos.empty(elem);
          },
          header: function(elem) {
            return rheader.test(elem.nodeName);
          },
          input: function(elem) {
            return rinputs.test(elem.nodeName);
          },
          button: function(elem) {
            return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
          },
          text: function(elem) {
            var attr;
            return nodeName(elem, "input") && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
          },
          first: createPositionalPseudo(function() {
            return [0];
          }),
          last: createPositionalPseudo(function(_matchIndexes, length) {
            return [length - 1];
          }),
          eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
            return [argument < 0 ? argument + length : argument];
          }),
          even: createPositionalPseudo(function(matchIndexes, length) {
            var i3 = 0;
            for (; i3 < length; i3 += 2) {
              matchIndexes.push(i3);
            }
            return matchIndexes;
          }),
          odd: createPositionalPseudo(function(matchIndexes, length) {
            var i3 = 1;
            for (; i3 < length; i3 += 2) {
              matchIndexes.push(i3);
            }
            return matchIndexes;
          }),
          lt: createPositionalPseudo(function(matchIndexes, length, argument) {
            var i3;
            if (argument < 0) {
              i3 = argument + length;
            } else if (argument > length) {
              i3 = length;
            } else {
              i3 = argument;
            }
            for (; --i3 >= 0; ) {
              matchIndexes.push(i3);
            }
            return matchIndexes;
          }),
          gt: createPositionalPseudo(function(matchIndexes, length, argument) {
            var i3 = argument < 0 ? argument + length : argument;
            for (; ++i3 < length; ) {
              matchIndexes.push(i3);
            }
            return matchIndexes;
          })
        }
      };
      Expr.pseudos.nth = Expr.pseudos.eq;
      for (i2 in { radio: true, checkbox: true, file: true, password: true, image: true }) {
        Expr.pseudos[i2] = createInputPseudo(i2);
      }
      for (i2 in { submit: true, reset: true }) {
        Expr.pseudos[i2] = createButtonPseudo(i2);
      }
      function setFilters() {
      }
      setFilters.prototype = Expr.filters = Expr.pseudos;
      Expr.setFilters = new setFilters();
      function tokenize(selector, parseOnly) {
        var matched, match, tokens, type2, soFar, groups, preFilters, cached = tokenCache[selector + " "];
        if (cached) {
          return parseOnly ? 0 : cached.slice(0);
        }
        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;
        while (soFar) {
          if (!matched || (match = rcomma.exec(soFar))) {
            if (match) {
              soFar = soFar.slice(match[0].length) || soFar;
            }
            groups.push(tokens = []);
          }
          matched = false;
          if (match = rleadingCombinator.exec(soFar)) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: match[0].replace(rtrimCSS, " ")
            });
            soFar = soFar.slice(matched.length);
          }
          for (type2 in Expr.filter) {
            if ((match = matchExpr[type2].exec(soFar)) && (!preFilters[type2] || (match = preFilters[type2](match)))) {
              matched = match.shift();
              tokens.push({
                value: matched,
                type: type2,
                matches: match
              });
              soFar = soFar.slice(matched.length);
            }
          }
          if (!matched) {
            break;
          }
        }
        if (parseOnly) {
          return soFar.length;
        }
        return soFar ? find.error(selector) : tokenCache(selector, groups).slice(0);
      }
      function toSelector(tokens) {
        var i3 = 0, len = tokens.length, selector = "";
        for (; i3 < len; i3++) {
          selector += tokens[i3].value;
        }
        return selector;
      }
      function addCombinator(matcher, combinator, base) {
        var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
        return combinator.first ? function(elem, context, xml) {
          while (elem = elem[dir2]) {
            if (elem.nodeType === 1 || checkNonElements) {
              return matcher(elem, context, xml);
            }
          }
          return false;
        } : function(elem, context, xml) {
          var oldCache, outerCache, newCache = [dirruns, doneName];
          if (xml) {
            while (elem = elem[dir2]) {
              if (elem.nodeType === 1 || checkNonElements) {
                if (matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          } else {
            while (elem = elem[dir2]) {
              if (elem.nodeType === 1 || checkNonElements) {
                outerCache = elem[expando] || (elem[expando] = {});
                if (skip && nodeName(elem, skip)) {
                  elem = elem[dir2] || elem;
                } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                  return newCache[2] = oldCache[2];
                } else {
                  outerCache[key] = newCache;
                  if (newCache[2] = matcher(elem, context, xml)) {
                    return true;
                  }
                }
              }
            }
          }
          return false;
        };
      }
      function elementMatcher(matchers) {
        return matchers.length > 1 ? function(elem, context, xml) {
          var i3 = matchers.length;
          while (i3--) {
            if (!matchers[i3](elem, context, xml)) {
              return false;
            }
          }
          return true;
        } : matchers[0];
      }
      function multipleContexts(selector, contexts, results) {
        var i3 = 0, len = contexts.length;
        for (; i3 < len; i3++) {
          find(selector, contexts[i3], results);
        }
        return results;
      }
      function condense(unmatched, map2, filter, context, xml) {
        var elem, newUnmatched = [], i3 = 0, len = unmatched.length, mapped = map2 != null;
        for (; i3 < len; i3++) {
          if (elem = unmatched[i3]) {
            if (!filter || filter(elem, context, xml)) {
              newUnmatched.push(elem);
              if (mapped) {
                map2.push(i3);
              }
            }
          }
        }
        return newUnmatched;
      }
      function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[expando]) {
          postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando]) {
          postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function(seed, results, context, xml) {
          var temp, i3, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
            selector || "*",
            context.nodeType ? [context] : context,
            []
          ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
          if (matcher) {
            matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results;
            matcher(matcherIn, matcherOut, context, xml);
          } else {
            matcherOut = matcherIn;
          }
          if (postFilter) {
            temp = condense(matcherOut, postMap);
            postFilter(temp, [], context, xml);
            i3 = temp.length;
            while (i3--) {
              if (elem = temp[i3]) {
                matcherOut[postMap[i3]] = !(matcherIn[postMap[i3]] = elem);
              }
            }
          }
          if (seed) {
            if (postFinder || preFilter) {
              if (postFinder) {
                temp = [];
                i3 = matcherOut.length;
                while (i3--) {
                  if (elem = matcherOut[i3]) {
                    temp.push(matcherIn[i3] = elem);
                  }
                }
                postFinder(null, matcherOut = [], temp, xml);
              }
              i3 = matcherOut.length;
              while (i3--) {
                if ((elem = matcherOut[i3]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i3]) > -1) {
                  seed[temp] = !(results[temp] = elem);
                }
              }
            }
          } else {
            matcherOut = condense(
              matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
            );
            if (postFinder) {
              postFinder(null, results, matcherOut, xml);
            } else {
              push2.apply(results, matcherOut);
            }
          }
        });
      }
      function matcherFromTokens(tokens) {
        var checkContext, matcher, j2, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i3 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
          return elem === checkContext;
        }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
          return indexOf.call(checkContext, elem) > -1;
        }, implicitRelative, true), matchers = [function(elem, context, xml) {
          var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
          checkContext = null;
          return ret;
        }];
        for (; i3 < len; i3++) {
          if (matcher = Expr.relative[tokens[i3].type]) {
            matchers = [addCombinator(elementMatcher(matchers), matcher)];
          } else {
            matcher = Expr.filter[tokens[i3].type].apply(null, tokens[i3].matches);
            if (matcher[expando]) {
              j2 = ++i3;
              for (; j2 < len; j2++) {
                if (Expr.relative[tokens[j2].type]) {
                  break;
                }
              }
              return setMatcher(
                i3 > 1 && elementMatcher(matchers),
                i3 > 1 && toSelector(
                  tokens.slice(0, i3 - 1).concat({ value: tokens[i3 - 2].type === " " ? "*" : "" })
                ).replace(rtrimCSS, "$1"),
                matcher,
                i3 < j2 && matcherFromTokens(tokens.slice(i3, j2)),
                j2 < len && matcherFromTokens(tokens = tokens.slice(j2)),
                j2 < len && toSelector(tokens)
              );
            }
            matchers.push(matcher);
          }
        }
        return elementMatcher(matchers);
      }
      function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
          var elem, j2, matcher, matchedCount = 0, i3 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
          if (outermost) {
            outermostContext = context == document3 || context || outermost;
          }
          for (; i3 !== len && (elem = elems[i3]) != null; i3++) {
            if (byElement && elem) {
              j2 = 0;
              if (!context && elem.ownerDocument != document3) {
                setDocument(elem);
                xml = !documentIsHTML;
              }
              while (matcher = elementMatchers[j2++]) {
                if (matcher(elem, context || document3, xml)) {
                  push2.call(results, elem);
                  break;
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
              }
            }
            if (bySet) {
              if (elem = !matcher && elem) {
                matchedCount--;
              }
              if (seed) {
                unmatched.push(elem);
              }
            }
          }
          matchedCount += i3;
          if (bySet && i3 !== matchedCount) {
            j2 = 0;
            while (matcher = setMatchers[j2++]) {
              matcher(unmatched, setMatched, context, xml);
            }
            if (seed) {
              if (matchedCount > 0) {
                while (i3--) {
                  if (!(unmatched[i3] || setMatched[i3])) {
                    setMatched[i3] = pop.call(results);
                  }
                }
              }
              setMatched = condense(setMatched);
            }
            push2.apply(results, setMatched);
            if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
              jQuery2.uniqueSort(results);
            }
          }
          if (outermost) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }
          return unmatched;
        };
        return bySet ? markFunction(superMatcher) : superMatcher;
      }
      function compile(selector, match) {
        var i3, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
        if (!cached) {
          if (!match) {
            match = tokenize(selector);
          }
          i3 = match.length;
          while (i3--) {
            cached = matcherFromTokens(match[i3]);
            if (cached[expando]) {
              setMatchers.push(cached);
            } else {
              elementMatchers.push(cached);
            }
          }
          cached = compilerCache(
            selector,
            matcherFromGroupMatchers(elementMatchers, setMatchers)
          );
          cached.selector = selector;
        }
        return cached;
      }
      function select(selector, context, results, seed) {
        var i3, tokens, token, type2, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
        results = results || [];
        if (match.length === 1) {
          tokens = match[0] = match[0].slice(0);
          if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
            context = (Expr.find.ID(
              token.matches[0].replace(runescape, funescape),
              context
            ) || [])[0];
            if (!context) {
              return results;
            } else if (compiled) {
              context = context.parentNode;
            }
            selector = selector.slice(tokens.shift().value.length);
          }
          i3 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
          while (i3--) {
            token = tokens[i3];
            if (Expr.relative[type2 = token.type]) {
              break;
            }
            if (find2 = Expr.find[type2]) {
              if (seed = find2(
                token.matches[0].replace(runescape, funescape),
                rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
              )) {
                tokens.splice(i3, 1);
                selector = seed.length && toSelector(tokens);
                if (!selector) {
                  push2.apply(results, seed);
                  return results;
                }
                break;
              }
            }
          }
        }
        (compiled || compile(selector, match))(
          seed,
          context,
          !documentIsHTML,
          results,
          !context || rsibling.test(selector) && testContext(context.parentNode) || context
        );
        return results;
      }
      support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
      setDocument();
      support.sortDetached = assert(function(el2) {
        return el2.compareDocumentPosition(document3.createElement("fieldset")) & 1;
      });
      jQuery2.find = find;
      jQuery2.expr[":"] = jQuery2.expr.pseudos;
      jQuery2.unique = jQuery2.uniqueSort;
      find.compile = compile;
      find.select = select;
      find.setDocument = setDocument;
      find.tokenize = tokenize;
      find.escape = jQuery2.escapeSelector;
      find.getText = jQuery2.text;
      find.isXML = jQuery2.isXMLDoc;
      find.selectors = jQuery2.expr;
      find.support = jQuery2.support;
      find.uniqueSort = jQuery2.uniqueSort;
    })();
    var dir = function(elem, dir2, until) {
      var matched = [], truncate = until !== void 0;
      while ((elem = elem[dir2]) && elem.nodeType !== 9) {
        if (elem.nodeType === 1) {
          if (truncate && jQuery2(elem).is(until)) {
            break;
          }
          matched.push(elem);
        }
      }
      return matched;
    };
    var siblings = function(n, elem) {
      var matched = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          matched.push(n);
        }
      }
      return matched;
    };
    var rneedsContext = jQuery2.expr.match.needsContext;
    var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function winnow(elements, qualifier, not2) {
      if (isFunction(qualifier)) {
        return jQuery2.grep(elements, function(elem, i2) {
          return !!qualifier.call(elem, i2, elem) !== not2;
        });
      }
      if (qualifier.nodeType) {
        return jQuery2.grep(elements, function(elem) {
          return elem === qualifier !== not2;
        });
      }
      if (typeof qualifier !== "string") {
        return jQuery2.grep(elements, function(elem) {
          return indexOf.call(qualifier, elem) > -1 !== not2;
        });
      }
      return jQuery2.filter(qualifier, elements, not2);
    }
    jQuery2.filter = function(expr, elems, not2) {
      var elem = elems[0];
      if (not2) {
        expr = ":not(" + expr + ")";
      }
      if (elems.length === 1 && elem.nodeType === 1) {
        return jQuery2.find.matchesSelector(elem, expr) ? [elem] : [];
      }
      return jQuery2.find.matches(expr, jQuery2.grep(elems, function(elem2) {
        return elem2.nodeType === 1;
      }));
    };
    jQuery2.fn.extend({
      find: function(selector) {
        var i2, ret, len = this.length, self2 = this;
        if (typeof selector !== "string") {
          return this.pushStack(jQuery2(selector).filter(function() {
            for (i2 = 0; i2 < len; i2++) {
              if (jQuery2.contains(self2[i2], this)) {
                return true;
              }
            }
          }));
        }
        ret = this.pushStack([]);
        for (i2 = 0; i2 < len; i2++) {
          jQuery2.find(selector, self2[i2], ret);
        }
        return len > 1 ? jQuery2.uniqueSort(ret) : ret;
      },
      filter: function(selector) {
        return this.pushStack(winnow(this, selector || [], false));
      },
      not: function(selector) {
        return this.pushStack(winnow(this, selector || [], true));
      },
      is: function(selector) {
        return !!winnow(
          this,
          typeof selector === "string" && rneedsContext.test(selector) ? jQuery2(selector) : selector || [],
          false
        ).length;
      }
    });
    var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery2.fn.init = function(selector, context, root2) {
      var match, elem;
      if (!selector) {
        return this;
      }
      root2 = root2 || rootjQuery;
      if (typeof selector === "string") {
        if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
          match = [null, selector, null];
        } else {
          match = rquickExpr.exec(selector);
        }
        if (match && (match[1] || !context)) {
          if (match[1]) {
            context = context instanceof jQuery2 ? context[0] : context;
            jQuery2.merge(this, jQuery2.parseHTML(
              match[1],
              context && context.nodeType ? context.ownerDocument || context : document2,
              true
            ));
            if (rsingleTag.test(match[1]) && jQuery2.isPlainObject(context)) {
              for (match in context) {
                if (isFunction(this[match])) {
                  this[match](context[match]);
                } else {
                  this.attr(match, context[match]);
                }
              }
            }
            return this;
          } else {
            elem = document2.getElementById(match[2]);
            if (elem) {
              this[0] = elem;
              this.length = 1;
            }
            return this;
          }
        } else if (!context || context.jquery) {
          return (context || root2).find(selector);
        } else {
          return this.constructor(context).find(selector);
        }
      } else if (selector.nodeType) {
        this[0] = selector;
        this.length = 1;
        return this;
      } else if (isFunction(selector)) {
        return root2.ready !== void 0 ? root2.ready(selector) : selector(jQuery2);
      }
      return jQuery2.makeArray(selector, this);
    };
    init.prototype = jQuery2.fn;
    rootjQuery = jQuery2(document2);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
    jQuery2.fn.extend({
      has: function(target2) {
        var targets = jQuery2(target2, this), l = targets.length;
        return this.filter(function() {
          var i2 = 0;
          for (; i2 < l; i2++) {
            if (jQuery2.contains(this, targets[i2])) {
              return true;
            }
          }
        });
      },
      closest: function(selectors, context) {
        var cur, i2 = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery2(selectors);
        if (!rneedsContext.test(selectors)) {
          for (; i2 < l; i2++) {
            for (cur = this[i2]; cur && cur !== context; cur = cur.parentNode) {
              if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : cur.nodeType === 1 && jQuery2.find.matchesSelector(cur, selectors))) {
                matched.push(cur);
                break;
              }
            }
          }
        }
        return this.pushStack(matched.length > 1 ? jQuery2.uniqueSort(matched) : matched);
      },
      index: function(elem) {
        if (!elem) {
          return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        }
        if (typeof elem === "string") {
          return indexOf.call(jQuery2(elem), this[0]);
        }
        return indexOf.call(
          this,
          elem.jquery ? elem[0] : elem
        );
      },
      add: function(selector, context) {
        return this.pushStack(
          jQuery2.uniqueSort(
            jQuery2.merge(this.get(), jQuery2(selector, context))
          )
        );
      },
      addBack: function(selector) {
        return this.add(
          selector == null ? this.prevObject : this.prevObject.filter(selector)
        );
      }
    });
    function sibling(cur, dir2) {
      while ((cur = cur[dir2]) && cur.nodeType !== 1) {
      }
      return cur;
    }
    jQuery2.each({
      parent: function(elem) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
      },
      parents: function(elem) {
        return dir(elem, "parentNode");
      },
      parentsUntil: function(elem, _i, until) {
        return dir(elem, "parentNode", until);
      },
      next: function(elem) {
        return sibling(elem, "nextSibling");
      },
      prev: function(elem) {
        return sibling(elem, "previousSibling");
      },
      nextAll: function(elem) {
        return dir(elem, "nextSibling");
      },
      prevAll: function(elem) {
        return dir(elem, "previousSibling");
      },
      nextUntil: function(elem, _i, until) {
        return dir(elem, "nextSibling", until);
      },
      prevUntil: function(elem, _i, until) {
        return dir(elem, "previousSibling", until);
      },
      siblings: function(elem) {
        return siblings((elem.parentNode || {}).firstChild, elem);
      },
      children: function(elem) {
        return siblings(elem.firstChild);
      },
      contents: function(elem) {
        if (elem.contentDocument != null && getProto2(elem.contentDocument)) {
          return elem.contentDocument;
        }
        if (nodeName(elem, "template")) {
          elem = elem.content || elem;
        }
        return jQuery2.merge([], elem.childNodes);
      }
    }, function(name, fn2) {
      jQuery2.fn[name] = function(until, selector) {
        var matched = jQuery2.map(this, fn2, until);
        if (name.slice(-5) !== "Until") {
          selector = until;
        }
        if (selector && typeof selector === "string") {
          matched = jQuery2.filter(selector, matched);
        }
        if (this.length > 1) {
          if (!guaranteedUnique[name]) {
            jQuery2.uniqueSort(matched);
          }
          if (rparentsprev.test(name)) {
            matched.reverse();
          }
        }
        return this.pushStack(matched);
      };
    });
    var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
    function createOptions(options) {
      var object = {};
      jQuery2.each(options.match(rnothtmlwhite) || [], function(_, flag) {
        object[flag] = true;
      });
      return object;
    }
    jQuery2.Callbacks = function(options) {
      options = typeof options === "string" ? createOptions(options) : jQuery2.extend({}, options);
      var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
        locked = locked || options.once;
        fired = firing = true;
        for (; queue.length; firingIndex = -1) {
          memory = queue.shift();
          while (++firingIndex < list.length) {
            if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
              firingIndex = list.length;
              memory = false;
            }
          }
        }
        if (!options.memory) {
          memory = false;
        }
        firing = false;
        if (locked) {
          if (memory) {
            list = [];
          } else {
            list = "";
          }
        }
      }, self2 = {
        add: function() {
          if (list) {
            if (memory && !firing) {
              firingIndex = list.length - 1;
              queue.push(memory);
            }
            (function add(args) {
              jQuery2.each(args, function(_, arg) {
                if (isFunction(arg)) {
                  if (!options.unique || !self2.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && toType(arg) !== "string") {
                  add(arg);
                }
              });
            })(arguments);
            if (memory && !firing) {
              fire();
            }
          }
          return this;
        },
        remove: function() {
          jQuery2.each(arguments, function(_, arg) {
            var index;
            while ((index = jQuery2.inArray(arg, list, index)) > -1) {
              list.splice(index, 1);
              if (index <= firingIndex) {
                firingIndex--;
              }
            }
          });
          return this;
        },
        has: function(fn2) {
          return fn2 ? jQuery2.inArray(fn2, list) > -1 : list.length > 0;
        },
        empty: function() {
          if (list) {
            list = [];
          }
          return this;
        },
        disable: function() {
          locked = queue = [];
          list = memory = "";
          return this;
        },
        disabled: function() {
          return !list;
        },
        lock: function() {
          locked = queue = [];
          if (!memory && !firing) {
            list = memory = "";
          }
          return this;
        },
        locked: function() {
          return !!locked;
        },
        fireWith: function(context, args) {
          if (!locked) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            queue.push(args);
            if (!firing) {
              fire();
            }
          }
          return this;
        },
        fire: function() {
          self2.fireWith(this, arguments);
          return this;
        },
        fired: function() {
          return !!fired;
        }
      };
      return self2;
    };
    function Identity(v) {
      return v;
    }
    function Thrower(ex) {
      throw ex;
    }
    function adoptValue(value, resolve, reject, noValue) {
      var method;
      try {
        if (value && isFunction(method = value.promise)) {
          method.call(value).done(resolve).fail(reject);
        } else if (value && isFunction(method = value.then)) {
          method.call(value, resolve, reject);
        } else {
          resolve.apply(void 0, [value].slice(noValue));
        }
      } catch (value2) {
        reject.apply(void 0, [value2]);
      }
    }
    jQuery2.extend({
      Deferred: function(func) {
        var tuples = [
          [
            "notify",
            "progress",
            jQuery2.Callbacks("memory"),
            jQuery2.Callbacks("memory"),
            2
          ],
          [
            "resolve",
            "done",
            jQuery2.Callbacks("once memory"),
            jQuery2.Callbacks("once memory"),
            0,
            "resolved"
          ],
          [
            "reject",
            "fail",
            jQuery2.Callbacks("once memory"),
            jQuery2.Callbacks("once memory"),
            1,
            "rejected"
          ]
        ], state = "pending", promise = {
          state: function() {
            return state;
          },
          always: function() {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          "catch": function(fn2) {
            return promise.then(null, fn2);
          },
          pipe: function() {
            var fns = arguments;
            return jQuery2.Deferred(function(newDefer) {
              jQuery2.each(tuples, function(_i, tuple) {
                var fn2 = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                deferred[tuple[1]](function() {
                  var returned = fn2 && fn2.apply(this, arguments);
                  if (returned && isFunction(returned.promise)) {
                    returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                  } else {
                    newDefer[tuple[0] + "With"](
                      this,
                      fn2 ? [returned] : arguments
                    );
                  }
                });
              });
              fns = null;
            }).promise();
          },
          then: function(onFulfilled, onRejected, onProgress) {
            var maxDepth = 0;
            function resolve(depth, deferred2, handler, special) {
              return function() {
                var that = this, args = arguments, mightThrow = function() {
                  var returned, then;
                  if (depth < maxDepth) {
                    return;
                  }
                  returned = handler.apply(that, args);
                  if (returned === deferred2.promise()) {
                    throw new TypeError("Thenable self-resolution");
                  }
                  then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
                  if (isFunction(then)) {
                    if (special) {
                      then.call(
                        returned,
                        resolve(maxDepth, deferred2, Identity, special),
                        resolve(maxDepth, deferred2, Thrower, special)
                      );
                    } else {
                      maxDepth++;
                      then.call(
                        returned,
                        resolve(maxDepth, deferred2, Identity, special),
                        resolve(maxDepth, deferred2, Thrower, special),
                        resolve(
                          maxDepth,
                          deferred2,
                          Identity,
                          deferred2.notifyWith
                        )
                      );
                    }
                  } else {
                    if (handler !== Identity) {
                      that = void 0;
                      args = [returned];
                    }
                    (special || deferred2.resolveWith)(that, args);
                  }
                }, process = special ? mightThrow : function() {
                  try {
                    mightThrow();
                  } catch (e) {
                    if (jQuery2.Deferred.exceptionHook) {
                      jQuery2.Deferred.exceptionHook(
                        e,
                        process.error
                      );
                    }
                    if (depth + 1 >= maxDepth) {
                      if (handler !== Thrower) {
                        that = void 0;
                        args = [e];
                      }
                      deferred2.rejectWith(that, args);
                    }
                  }
                };
                if (depth) {
                  process();
                } else {
                  if (jQuery2.Deferred.getErrorHook) {
                    process.error = jQuery2.Deferred.getErrorHook();
                  } else if (jQuery2.Deferred.getStackHook) {
                    process.error = jQuery2.Deferred.getStackHook();
                  }
                  window2.setTimeout(process);
                }
              };
            }
            return jQuery2.Deferred(function(newDefer) {
              tuples[0][3].add(
                resolve(
                  0,
                  newDefer,
                  isFunction(onProgress) ? onProgress : Identity,
                  newDefer.notifyWith
                )
              );
              tuples[1][3].add(
                resolve(
                  0,
                  newDefer,
                  isFunction(onFulfilled) ? onFulfilled : Identity
                )
              );
              tuples[2][3].add(
                resolve(
                  0,
                  newDefer,
                  isFunction(onRejected) ? onRejected : Thrower
                )
              );
            }).promise();
          },
          promise: function(obj) {
            return obj != null ? jQuery2.extend(obj, promise) : promise;
          }
        }, deferred = {};
        jQuery2.each(tuples, function(i2, tuple) {
          var list = tuple[2], stateString = tuple[5];
          promise[tuple[1]] = list.add;
          if (stateString) {
            list.add(
              function() {
                state = stateString;
              },
              tuples[3 - i2][2].disable,
              tuples[3 - i2][3].disable,
              tuples[0][2].lock,
              tuples[0][3].lock
            );
          }
          list.add(tuple[3].fire);
          deferred[tuple[0]] = function() {
            deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
            return this;
          };
          deferred[tuple[0] + "With"] = list.fireWith;
        });
        promise.promise(deferred);
        if (func) {
          func.call(deferred, deferred);
        }
        return deferred;
      },
      when: function(singleValue) {
        var remaining = arguments.length, i2 = remaining, resolveContexts = Array(i2), resolveValues = slice.call(arguments), primary = jQuery2.Deferred(), updateFunc = function(i3) {
          return function(value) {
            resolveContexts[i3] = this;
            resolveValues[i3] = arguments.length > 1 ? slice.call(arguments) : value;
            if (!--remaining) {
              primary.resolveWith(resolveContexts, resolveValues);
            }
          };
        };
        if (remaining <= 1) {
          adoptValue(
            singleValue,
            primary.done(updateFunc(i2)).resolve,
            primary.reject,
            !remaining
          );
          if (primary.state() === "pending" || isFunction(resolveValues[i2] && resolveValues[i2].then)) {
            return primary.then();
          }
        }
        while (i2--) {
          adoptValue(resolveValues[i2], updateFunc(i2), primary.reject);
        }
        return primary.promise();
      }
    });
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    jQuery2.Deferred.exceptionHook = function(error, asyncError) {
      if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
        window2.console.warn(
          "jQuery.Deferred exception: " + error.message,
          error.stack,
          asyncError
        );
      }
    };
    jQuery2.readyException = function(error) {
      window2.setTimeout(function() {
        throw error;
      });
    };
    var readyList = jQuery2.Deferred();
    jQuery2.fn.ready = function(fn2) {
      readyList.then(fn2).catch(function(error) {
        jQuery2.readyException(error);
      });
      return this;
    };
    jQuery2.extend({
      isReady: false,
      readyWait: 1,
      ready: function(wait) {
        if (wait === true ? --jQuery2.readyWait : jQuery2.isReady) {
          return;
        }
        jQuery2.isReady = true;
        if (wait !== true && --jQuery2.readyWait > 0) {
          return;
        }
        readyList.resolveWith(document2, [jQuery2]);
      }
    });
    jQuery2.ready.then = readyList.then;
    function completed() {
      document2.removeEventListener("DOMContentLoaded", completed);
      window2.removeEventListener("load", completed);
      jQuery2.ready();
    }
    if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
      window2.setTimeout(jQuery2.ready);
    } else {
      document2.addEventListener("DOMContentLoaded", completed);
      window2.addEventListener("load", completed);
    }
    var access = function(elems, fn2, key, value, chainable, emptyGet, raw) {
      var i2 = 0, len = elems.length, bulk = key == null;
      if (toType(key) === "object") {
        chainable = true;
        for (i2 in key) {
          access(elems, fn2, i2, key[i2], true, emptyGet, raw);
        }
      } else if (value !== void 0) {
        chainable = true;
        if (!isFunction(value)) {
          raw = true;
        }
        if (bulk) {
          if (raw) {
            fn2.call(elems, value);
            fn2 = null;
          } else {
            bulk = fn2;
            fn2 = function(elem, _key, value2) {
              return bulk.call(jQuery2(elem), value2);
            };
          }
        }
        if (fn2) {
          for (; i2 < len; i2++) {
            fn2(
              elems[i2],
              key,
              raw ? value : value.call(elems[i2], i2, fn2(elems[i2], key))
            );
          }
        }
      }
      if (chainable) {
        return elems;
      }
      if (bulk) {
        return fn2.call(elems);
      }
      return len ? fn2(elems[0], key) : emptyGet;
    };
    var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
    function fcamelCase(_all, letter) {
      return letter.toUpperCase();
    }
    function camelCase(string) {
      return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    }
    var acceptData = function(owner) {
      return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
    };
    function Data() {
      this.expando = jQuery2.expando + Data.uid++;
    }
    Data.uid = 1;
    Data.prototype = {
      cache: function(owner) {
        var value = owner[this.expando];
        if (!value) {
          value = {};
          if (acceptData(owner)) {
            if (owner.nodeType) {
              owner[this.expando] = value;
            } else {
              Object.defineProperty(owner, this.expando, {
                value,
                configurable: true
              });
            }
          }
        }
        return value;
      },
      set: function(owner, data, value) {
        var prop2, cache = this.cache(owner);
        if (typeof data === "string") {
          cache[camelCase(data)] = value;
        } else {
          for (prop2 in data) {
            cache[camelCase(prop2)] = data[prop2];
          }
        }
        return cache;
      },
      get: function(owner, key) {
        return key === void 0 ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
      },
      access: function(owner, key, value) {
        if (key === void 0 || key && typeof key === "string" && value === void 0) {
          return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !== void 0 ? value : key;
      },
      remove: function(owner, key) {
        var i2, cache = owner[this.expando];
        if (cache === void 0) {
          return;
        }
        if (key !== void 0) {
          if (Array.isArray(key)) {
            key = key.map(camelCase);
          } else {
            key = camelCase(key);
            key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
          }
          i2 = key.length;
          while (i2--) {
            delete cache[key[i2]];
          }
        }
        if (key === void 0 || jQuery2.isEmptyObject(cache)) {
          if (owner.nodeType) {
            owner[this.expando] = void 0;
          } else {
            delete owner[this.expando];
          }
        }
      },
      hasData: function(owner) {
        var cache = owner[this.expando];
        return cache !== void 0 && !jQuery2.isEmptyObject(cache);
      }
    };
    var dataPriv = new Data();
    var dataUser = new Data();
    var rbrace2 = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
    function getData(data) {
      if (data === "true") {
        return true;
      }
      if (data === "false") {
        return false;
      }
      if (data === "null") {
        return null;
      }
      if (data === +data + "") {
        return +data;
      }
      if (rbrace2.test(data)) {
        return JSON.parse(data);
      }
      return data;
    }
    function dataAttr(elem, key, data) {
      var name;
      if (data === void 0 && elem.nodeType === 1) {
        name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
        data = elem.getAttribute(name);
        if (typeof data === "string") {
          try {
            data = getData(data);
          } catch (e) {
          }
          dataUser.set(elem, key, data);
        } else {
          data = void 0;
        }
      }
      return data;
    }
    jQuery2.extend({
      hasData: function(elem) {
        return dataUser.hasData(elem) || dataPriv.hasData(elem);
      },
      data: function(elem, name, data) {
        return dataUser.access(elem, name, data);
      },
      removeData: function(elem, name) {
        dataUser.remove(elem, name);
      },
      _data: function(elem, name, data) {
        return dataPriv.access(elem, name, data);
      },
      _removeData: function(elem, name) {
        dataPriv.remove(elem, name);
      }
    });
    jQuery2.fn.extend({
      data: function(key, value) {
        var i2, name, data, elem = this[0], attrs = elem && elem.attributes;
        if (key === void 0) {
          if (this.length) {
            data = dataUser.get(elem);
            if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
              i2 = attrs.length;
              while (i2--) {
                if (attrs[i2]) {
                  name = attrs[i2].name;
                  if (name.indexOf("data-") === 0) {
                    name = camelCase(name.slice(5));
                    dataAttr(elem, name, data[name]);
                  }
                }
              }
              dataPriv.set(elem, "hasDataAttrs", true);
            }
          }
          return data;
        }
        if (typeof key === "object") {
          return this.each(function() {
            dataUser.set(this, key);
          });
        }
        return access(this, function(value2) {
          var data2;
          if (elem && value2 === void 0) {
            data2 = dataUser.get(elem, key);
            if (data2 !== void 0) {
              return data2;
            }
            data2 = dataAttr(elem, key);
            if (data2 !== void 0) {
              return data2;
            }
            return;
          }
          this.each(function() {
            dataUser.set(this, key, value2);
          });
        }, null, value, arguments.length > 1, null, true);
      },
      removeData: function(key) {
        return this.each(function() {
          dataUser.remove(this, key);
        });
      }
    });
    jQuery2.extend({
      queue: function(elem, type2, data) {
        var queue;
        if (elem) {
          type2 = (type2 || "fx") + "queue";
          queue = dataPriv.get(elem, type2);
          if (data) {
            if (!queue || Array.isArray(data)) {
              queue = dataPriv.access(elem, type2, jQuery2.makeArray(data));
            } else {
              queue.push(data);
            }
          }
          return queue || [];
        }
      },
      dequeue: function(elem, type2) {
        type2 = type2 || "fx";
        var queue = jQuery2.queue(elem, type2), startLength = queue.length, fn2 = queue.shift(), hooks = jQuery2._queueHooks(elem, type2), next = function() {
          jQuery2.dequeue(elem, type2);
        };
        if (fn2 === "inprogress") {
          fn2 = queue.shift();
          startLength--;
        }
        if (fn2) {
          if (type2 === "fx") {
            queue.unshift("inprogress");
          }
          delete hooks.stop;
          fn2.call(elem, next, hooks);
        }
        if (!startLength && hooks) {
          hooks.empty.fire();
        }
      },
      _queueHooks: function(elem, type2) {
        var key = type2 + "queueHooks";
        return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
          empty: jQuery2.Callbacks("once memory").add(function() {
            dataPriv.remove(elem, [type2 + "queue", key]);
          })
        });
      }
    });
    jQuery2.fn.extend({
      queue: function(type2, data) {
        var setter = 2;
        if (typeof type2 !== "string") {
          data = type2;
          type2 = "fx";
          setter--;
        }
        if (arguments.length < setter) {
          return jQuery2.queue(this[0], type2);
        }
        return data === void 0 ? this : this.each(function() {
          var queue = jQuery2.queue(this, type2, data);
          jQuery2._queueHooks(this, type2);
          if (type2 === "fx" && queue[0] !== "inprogress") {
            jQuery2.dequeue(this, type2);
          }
        });
      },
      dequeue: function(type2) {
        return this.each(function() {
          jQuery2.dequeue(this, type2);
        });
      },
      clearQueue: function(type2) {
        return this.queue(type2 || "fx", []);
      },
      promise: function(type2, obj) {
        var tmp, count = 1, defer = jQuery2.Deferred(), elements = this, i2 = this.length, resolve = function() {
          if (!--count) {
            defer.resolveWith(elements, [elements]);
          }
        };
        if (typeof type2 !== "string") {
          obj = type2;
          type2 = void 0;
        }
        type2 = type2 || "fx";
        while (i2--) {
          tmp = dataPriv.get(elements[i2], type2 + "queueHooks");
          if (tmp && tmp.empty) {
            count++;
            tmp.empty.add(resolve);
          }
        }
        resolve();
        return defer.promise(obj);
      }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
    var cssExpand = ["Top", "Right", "Bottom", "Left"];
    var documentElement = document2.documentElement;
    var isAttached = function(elem) {
      return jQuery2.contains(elem.ownerDocument, elem);
    }, composed = { composed: true };
    if (documentElement.getRootNode) {
      isAttached = function(elem) {
        return jQuery2.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
      };
    }
    var isHiddenWithinTree = function(elem, el2) {
      elem = el2 || elem;
      return elem.style.display === "none" || elem.style.display === "" && isAttached(elem) && jQuery2.css(elem, "display") === "none";
    };
    function adjustCSS(elem, prop2, valueParts, tween) {
      var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
        return tween.cur();
      } : function() {
        return jQuery2.css(elem, prop2, "");
      }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery2.cssNumber[prop2] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery2.cssNumber[prop2] || unit !== "px" && +initial) && rcssNum.exec(jQuery2.css(elem, prop2));
      if (initialInUnit && initialInUnit[3] !== unit) {
        initial = initial / 2;
        unit = unit || initialInUnit[3];
        initialInUnit = +initial || 1;
        while (maxIterations--) {
          jQuery2.style(elem, prop2, initialInUnit + unit);
          if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
            maxIterations = 0;
          }
          initialInUnit = initialInUnit / scale;
        }
        initialInUnit = initialInUnit * 2;
        jQuery2.style(elem, prop2, initialInUnit + unit);
        valueParts = valueParts || [];
      }
      if (valueParts) {
        initialInUnit = +initialInUnit || +initial || 0;
        adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
        if (tween) {
          tween.unit = unit;
          tween.start = initialInUnit;
          tween.end = adjusted;
        }
      }
      return adjusted;
    }
    var defaultDisplayMap = {};
    function getDefaultDisplay(elem) {
      var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
      if (display) {
        return display;
      }
      temp = doc.body.appendChild(doc.createElement(nodeName2));
      display = jQuery2.css(temp, "display");
      temp.parentNode.removeChild(temp);
      if (display === "none") {
        display = "block";
      }
      defaultDisplayMap[nodeName2] = display;
      return display;
    }
    function showHide(elements, show) {
      var display, elem, values = [], index = 0, length = elements.length;
      for (; index < length; index++) {
        elem = elements[index];
        if (!elem.style) {
          continue;
        }
        display = elem.style.display;
        if (show) {
          if (display === "none") {
            values[index] = dataPriv.get(elem, "display") || null;
            if (!values[index]) {
              elem.style.display = "";
            }
          }
          if (elem.style.display === "" && isHiddenWithinTree(elem)) {
            values[index] = getDefaultDisplay(elem);
          }
        } else {
          if (display !== "none") {
            values[index] = "none";
            dataPriv.set(elem, "display", display);
          }
        }
      }
      for (index = 0; index < length; index++) {
        if (values[index] != null) {
          elements[index].style.display = values[index];
        }
      }
      return elements;
    }
    jQuery2.fn.extend({
      show: function() {
        return showHide(this, true);
      },
      hide: function() {
        return showHide(this);
      },
      toggle: function(state) {
        if (typeof state === "boolean") {
          return state ? this.show() : this.hide();
        }
        return this.each(function() {
          if (isHiddenWithinTree(this)) {
            jQuery2(this).show();
          } else {
            jQuery2(this).hide();
          }
        });
      }
    });
    var rcheckableType = /^(?:checkbox|radio)$/i;
    var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
    var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
    (function() {
      var fragment = document2.createDocumentFragment(), div2 = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("checked", "checked");
      input.setAttribute("name", "t");
      div2.appendChild(input);
      support.checkClone = div2.cloneNode(true).cloneNode(true).lastChild.checked;
      div2.innerHTML = "<textarea>x</textarea>";
      support.noCloneChecked = !!div2.cloneNode(true).lastChild.defaultValue;
      div2.innerHTML = "<option></option>";
      support.option = !!div2.lastChild;
    })();
    var wrapMap = {
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    if (!support.option) {
      wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
    }
    function getAll(context, tag) {
      var ret;
      if (typeof context.getElementsByTagName !== "undefined") {
        ret = context.getElementsByTagName(tag || "*");
      } else if (typeof context.querySelectorAll !== "undefined") {
        ret = context.querySelectorAll(tag || "*");
      } else {
        ret = [];
      }
      if (tag === void 0 || tag && nodeName(context, tag)) {
        return jQuery2.merge([context], ret);
      }
      return ret;
    }
    function setGlobalEval(elems, refElements) {
      var i2 = 0, l = elems.length;
      for (; i2 < l; i2++) {
        dataPriv.set(
          elems[i2],
          "globalEval",
          !refElements || dataPriv.get(refElements[i2], "globalEval")
        );
      }
    }
    var rhtml = /<|&#?\w+;/;
    function buildFragment(elems, context, scripts, selection, ignored) {
      var elem, tmp, tag, wrap, attached, j2, fragment = context.createDocumentFragment(), nodes = [], i2 = 0, l = elems.length;
      for (; i2 < l; i2++) {
        elem = elems[i2];
        if (elem || elem === 0) {
          if (toType(elem) === "object") {
            jQuery2.merge(nodes, elem.nodeType ? [elem] : elem);
          } else if (!rhtml.test(elem)) {
            nodes.push(context.createTextNode(elem));
          } else {
            tmp = tmp || fragment.appendChild(context.createElement("div"));
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + jQuery2.htmlPrefilter(elem) + wrap[2];
            j2 = wrap[0];
            while (j2--) {
              tmp = tmp.lastChild;
            }
            jQuery2.merge(nodes, tmp.childNodes);
            tmp = fragment.firstChild;
            tmp.textContent = "";
          }
        }
      }
      fragment.textContent = "";
      i2 = 0;
      while (elem = nodes[i2++]) {
        if (selection && jQuery2.inArray(elem, selection) > -1) {
          if (ignored) {
            ignored.push(elem);
          }
          continue;
        }
        attached = isAttached(elem);
        tmp = getAll(fragment.appendChild(elem), "script");
        if (attached) {
          setGlobalEval(tmp);
        }
        if (scripts) {
          j2 = 0;
          while (elem = tmp[j2++]) {
            if (rscriptType.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
      return fragment;
    }
    var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
    function returnTrue() {
      return true;
    }
    function returnFalse() {
      return false;
    }
    function on(elem, types, selector, data, fn2, one) {
      var origFn, type2;
      if (typeof types === "object") {
        if (typeof selector !== "string") {
          data = data || selector;
          selector = void 0;
        }
        for (type2 in types) {
          on(elem, type2, selector, data, types[type2], one);
        }
        return elem;
      }
      if (data == null && fn2 == null) {
        fn2 = selector;
        data = selector = void 0;
      } else if (fn2 == null) {
        if (typeof selector === "string") {
          fn2 = data;
          data = void 0;
        } else {
          fn2 = data;
          data = selector;
          selector = void 0;
        }
      }
      if (fn2 === false) {
        fn2 = returnFalse;
      } else if (!fn2) {
        return elem;
      }
      if (one === 1) {
        origFn = fn2;
        fn2 = function(event) {
          jQuery2().off(event);
          return origFn.apply(this, arguments);
        };
        fn2.guid = origFn.guid || (origFn.guid = jQuery2.guid++);
      }
      return elem.each(function() {
        jQuery2.event.add(this, types, fn2, data, selector);
      });
    }
    jQuery2.event = {
      global: {},
      add: function(elem, types, handler, data, selector) {
        var handleObjIn, eventHandle, tmp, events2, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.get(elem);
        if (!acceptData(elem)) {
          return;
        }
        if (handler.handler) {
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (selector) {
          jQuery2.find.matchesSelector(documentElement, selector);
        }
        if (!handler.guid) {
          handler.guid = jQuery2.guid++;
        }
        if (!(events2 = elemData.events)) {
          events2 = elemData.events = /* @__PURE__ */ Object.create(null);
        }
        if (!(eventHandle = elemData.handle)) {
          eventHandle = elemData.handle = function(e) {
            return typeof jQuery2 !== "undefined" && jQuery2.event.triggered !== e.type ? jQuery2.event.dispatch.apply(elem, arguments) : void 0;
          };
        }
        types = (types || "").match(rnothtmlwhite) || [""];
        t = types.length;
        while (t--) {
          tmp = rtypenamespace.exec(types[t]) || [];
          type2 = origType = tmp[1];
          namespaces = (tmp[2] || "").split(".").sort();
          if (!type2) {
            continue;
          }
          special = jQuery2.event.special[type2] || {};
          type2 = (selector ? special.delegateType : special.bindType) || type2;
          special = jQuery2.event.special[type2] || {};
          handleObj = jQuery2.extend({
            type: type2,
            origType,
            data,
            handler,
            guid: handler.guid,
            selector,
            needsContext: selector && jQuery2.expr.match.needsContext.test(selector),
            namespace: namespaces.join(".")
          }, handleObjIn);
          if (!(handlers = events2[type2])) {
            handlers = events2[type2] = [];
            handlers.delegateCount = 0;
            if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
              if (elem.addEventListener) {
                elem.addEventListener(type2, eventHandle);
              }
            }
          }
          if (special.add) {
            special.add.call(elem, handleObj);
            if (!handleObj.handler.guid) {
              handleObj.handler.guid = handler.guid;
            }
          }
          if (selector) {
            handlers.splice(handlers.delegateCount++, 0, handleObj);
          } else {
            handlers.push(handleObj);
          }
          jQuery2.event.global[type2] = true;
        }
      },
      remove: function(elem, types, handler, selector, mappedTypes) {
        var j2, origCount, tmp, events2, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
        if (!elemData || !(events2 = elemData.events)) {
          return;
        }
        types = (types || "").match(rnothtmlwhite) || [""];
        t = types.length;
        while (t--) {
          tmp = rtypenamespace.exec(types[t]) || [];
          type2 = origType = tmp[1];
          namespaces = (tmp[2] || "").split(".").sort();
          if (!type2) {
            for (type2 in events2) {
              jQuery2.event.remove(elem, type2 + types[t], handler, selector, true);
            }
            continue;
          }
          special = jQuery2.event.special[type2] || {};
          type2 = (selector ? special.delegateType : special.bindType) || type2;
          handlers = events2[type2] || [];
          tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
          origCount = j2 = handlers.length;
          while (j2--) {
            handleObj = handlers[j2];
            if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
              handlers.splice(j2, 1);
              if (handleObj.selector) {
                handlers.delegateCount--;
              }
              if (special.remove) {
                special.remove.call(elem, handleObj);
              }
            }
          }
          if (origCount && !handlers.length) {
            if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
              jQuery2.removeEvent(elem, type2, elemData.handle);
            }
            delete events2[type2];
          }
        }
        if (jQuery2.isEmptyObject(events2)) {
          dataPriv.remove(elem, "handle events");
        }
      },
      dispatch: function(nativeEvent) {
        var i2, j2, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery2.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery2.event.special[event.type] || {};
        args[0] = event;
        for (i2 = 1; i2 < arguments.length; i2++) {
          args[i2] = arguments[i2];
        }
        event.delegateTarget = this;
        if (special.preDispatch && special.preDispatch.call(this, event) === false) {
          return;
        }
        handlerQueue = jQuery2.event.handlers.call(this, event, handlers);
        i2 = 0;
        while ((matched = handlerQueue[i2++]) && !event.isPropagationStopped()) {
          event.currentTarget = matched.elem;
          j2 = 0;
          while ((handleObj = matched.handlers[j2++]) && !event.isImmediatePropagationStopped()) {
            if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
              event.handleObj = handleObj;
              event.data = handleObj.data;
              ret = ((jQuery2.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
              if (ret !== void 0) {
                if ((event.result = ret) === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }
            }
          }
        }
        if (special.postDispatch) {
          special.postDispatch.call(this, event);
        }
        return event.result;
      },
      handlers: function(event, handlers) {
        var i2, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
        if (delegateCount && cur.nodeType && !(event.type === "click" && event.button >= 1)) {
          for (; cur !== this; cur = cur.parentNode || this) {
            if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
              matchedHandlers = [];
              matchedSelectors = {};
              for (i2 = 0; i2 < delegateCount; i2++) {
                handleObj = handlers[i2];
                sel = handleObj.selector + " ";
                if (matchedSelectors[sel] === void 0) {
                  matchedSelectors[sel] = handleObj.needsContext ? jQuery2(sel, this).index(cur) > -1 : jQuery2.find(sel, this, null, [cur]).length;
                }
                if (matchedSelectors[sel]) {
                  matchedHandlers.push(handleObj);
                }
              }
              if (matchedHandlers.length) {
                handlerQueue.push({ elem: cur, handlers: matchedHandlers });
              }
            }
          }
        }
        cur = this;
        if (delegateCount < handlers.length) {
          handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
        }
        return handlerQueue;
      },
      addProp: function(name, hook) {
        Object.defineProperty(jQuery2.Event.prototype, name, {
          enumerable: true,
          configurable: true,
          get: isFunction(hook) ? function() {
            if (this.originalEvent) {
              return hook(this.originalEvent);
            }
          } : function() {
            if (this.originalEvent) {
              return this.originalEvent[name];
            }
          },
          set: function(value) {
            Object.defineProperty(this, name, {
              enumerable: true,
              configurable: true,
              writable: true,
              value
            });
          }
        });
      },
      fix: function(originalEvent) {
        return originalEvent[jQuery2.expando] ? originalEvent : new jQuery2.Event(originalEvent);
      },
      special: {
        load: {
          noBubble: true
        },
        click: {
          setup: function(data) {
            var el2 = this || data;
            if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
              leverageNative(el2, "click", true);
            }
            return false;
          },
          trigger: function(data) {
            var el2 = this || data;
            if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
              leverageNative(el2, "click");
            }
            return true;
          },
          _default: function(event) {
            var target2 = event.target;
            return rcheckableType.test(target2.type) && target2.click && nodeName(target2, "input") && dataPriv.get(target2, "click") || nodeName(target2, "a");
          }
        },
        beforeunload: {
          postDispatch: function(event) {
            if (event.result !== void 0 && event.originalEvent) {
              event.originalEvent.returnValue = event.result;
            }
          }
        }
      }
    };
    function leverageNative(el2, type2, isSetup) {
      if (!isSetup) {
        if (dataPriv.get(el2, type2) === void 0) {
          jQuery2.event.add(el2, type2, returnTrue);
        }
        return;
      }
      dataPriv.set(el2, type2, false);
      jQuery2.event.add(el2, type2, {
        namespace: false,
        handler: function(event) {
          var result, saved = dataPriv.get(this, type2);
          if (event.isTrigger & 1 && this[type2]) {
            if (!saved) {
              saved = slice.call(arguments);
              dataPriv.set(this, type2, saved);
              this[type2]();
              result = dataPriv.get(this, type2);
              dataPriv.set(this, type2, false);
              if (saved !== result) {
                event.stopImmediatePropagation();
                event.preventDefault();
                return result;
              }
            } else if ((jQuery2.event.special[type2] || {}).delegateType) {
              event.stopPropagation();
            }
          } else if (saved) {
            dataPriv.set(this, type2, jQuery2.event.trigger(
              saved[0],
              saved.slice(1),
              this
            ));
            event.stopPropagation();
            event.isImmediatePropagationStopped = returnTrue;
          }
        }
      });
    }
    jQuery2.removeEvent = function(elem, type2, handle) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type2, handle);
      }
    };
    jQuery2.Event = function(src, props) {
      if (!(this instanceof jQuery2.Event)) {
        return new jQuery2.Event(src, props);
      }
      if (src && src.type) {
        this.originalEvent = src;
        this.type = src.type;
        this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && src.returnValue === false ? returnTrue : returnFalse;
        this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
        this.currentTarget = src.currentTarget;
        this.relatedTarget = src.relatedTarget;
      } else {
        this.type = src;
      }
      if (props) {
        jQuery2.extend(this, props);
      }
      this.timeStamp = src && src.timeStamp || Date.now();
      this[jQuery2.expando] = true;
    };
    jQuery2.Event.prototype = {
      constructor: jQuery2.Event,
      isDefaultPrevented: returnFalse,
      isPropagationStopped: returnFalse,
      isImmediatePropagationStopped: returnFalse,
      isSimulated: false,
      preventDefault: function() {
        var e = this.originalEvent;
        this.isDefaultPrevented = returnTrue;
        if (e && !this.isSimulated) {
          e.preventDefault();
        }
      },
      stopPropagation: function() {
        var e = this.originalEvent;
        this.isPropagationStopped = returnTrue;
        if (e && !this.isSimulated) {
          e.stopPropagation();
        }
      },
      stopImmediatePropagation: function() {
        var e = this.originalEvent;
        this.isImmediatePropagationStopped = returnTrue;
        if (e && !this.isSimulated) {
          e.stopImmediatePropagation();
        }
        this.stopPropagation();
      }
    };
    jQuery2.each({
      altKey: true,
      bubbles: true,
      cancelable: true,
      changedTouches: true,
      ctrlKey: true,
      detail: true,
      eventPhase: true,
      metaKey: true,
      pageX: true,
      pageY: true,
      shiftKey: true,
      view: true,
      "char": true,
      code: true,
      charCode: true,
      key: true,
      keyCode: true,
      button: true,
      buttons: true,
      clientX: true,
      clientY: true,
      offsetX: true,
      offsetY: true,
      pointerId: true,
      pointerType: true,
      screenX: true,
      screenY: true,
      targetTouches: true,
      toElement: true,
      touches: true,
      which: true
    }, jQuery2.event.addProp);
    jQuery2.each({ focus: "focusin", blur: "focusout" }, function(type2, delegateType) {
      function focusMappedHandler(nativeEvent) {
        if (document2.documentMode) {
          var handle = dataPriv.get(this, "handle"), event = jQuery2.event.fix(nativeEvent);
          event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
          event.isSimulated = true;
          handle(nativeEvent);
          if (event.target === event.currentTarget) {
            handle(event);
          }
        } else {
          jQuery2.event.simulate(
            delegateType,
            nativeEvent.target,
            jQuery2.event.fix(nativeEvent)
          );
        }
      }
      jQuery2.event.special[type2] = {
        setup: function() {
          var attaches;
          leverageNative(this, type2, true);
          if (document2.documentMode) {
            attaches = dataPriv.get(this, delegateType);
            if (!attaches) {
              this.addEventListener(delegateType, focusMappedHandler);
            }
            dataPriv.set(this, delegateType, (attaches || 0) + 1);
          } else {
            return false;
          }
        },
        trigger: function() {
          leverageNative(this, type2);
          return true;
        },
        teardown: function() {
          var attaches;
          if (document2.documentMode) {
            attaches = dataPriv.get(this, delegateType) - 1;
            if (!attaches) {
              this.removeEventListener(delegateType, focusMappedHandler);
              dataPriv.remove(this, delegateType);
            } else {
              dataPriv.set(this, delegateType, attaches);
            }
          } else {
            return false;
          }
        },
        _default: function(event) {
          return dataPriv.get(event.target, type2);
        },
        delegateType
      };
      jQuery2.event.special[delegateType] = {
        setup: function() {
          var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
          if (!attaches) {
            if (document2.documentMode) {
              this.addEventListener(delegateType, focusMappedHandler);
            } else {
              doc.addEventListener(type2, focusMappedHandler, true);
            }
          }
          dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
        },
        teardown: function() {
          var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
          if (!attaches) {
            if (document2.documentMode) {
              this.removeEventListener(delegateType, focusMappedHandler);
            } else {
              doc.removeEventListener(type2, focusMappedHandler, true);
            }
            dataPriv.remove(dataHolder, delegateType);
          } else {
            dataPriv.set(dataHolder, delegateType, attaches);
          }
        }
      };
    });
    jQuery2.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(orig, fix) {
      jQuery2.event.special[orig] = {
        delegateType: fix,
        bindType: fix,
        handle: function(event) {
          var ret, target2 = this, related = event.relatedTarget, handleObj = event.handleObj;
          if (!related || related !== target2 && !jQuery2.contains(target2, related)) {
            event.type = handleObj.origType;
            ret = handleObj.handler.apply(this, arguments);
            event.type = fix;
          }
          return ret;
        }
      };
    });
    jQuery2.fn.extend({
      on: function(types, selector, data, fn2) {
        return on(this, types, selector, data, fn2);
      },
      one: function(types, selector, data, fn2) {
        return on(this, types, selector, data, fn2, 1);
      },
      off: function(types, selector, fn2) {
        var handleObj, type2;
        if (types && types.preventDefault && types.handleObj) {
          handleObj = types.handleObj;
          jQuery2(types.delegateTarget).off(
            handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
            handleObj.selector,
            handleObj.handler
          );
          return this;
        }
        if (typeof types === "object") {
          for (type2 in types) {
            this.off(type2, selector, types[type2]);
          }
          return this;
        }
        if (selector === false || typeof selector === "function") {
          fn2 = selector;
          selector = void 0;
        }
        if (fn2 === false) {
          fn2 = returnFalse;
        }
        return this.each(function() {
          jQuery2.event.remove(this, types, fn2, selector);
        });
      }
    });
    var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
    function manipulationTarget(elem, content) {
      if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
        return jQuery2(elem).children("tbody")[0] || elem;
      }
      return elem;
    }
    function disableScript(elem) {
      elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
      return elem;
    }
    function restoreScript(elem) {
      if ((elem.type || "").slice(0, 5) === "true/") {
        elem.type = elem.type.slice(5);
      } else {
        elem.removeAttribute("type");
      }
      return elem;
    }
    function cloneCopyEvent(src, dest) {
      var i2, l, type2, pdataOld, udataOld, udataCur, events2;
      if (dest.nodeType !== 1) {
        return;
      }
      if (dataPriv.hasData(src)) {
        pdataOld = dataPriv.get(src);
        events2 = pdataOld.events;
        if (events2) {
          dataPriv.remove(dest, "handle events");
          for (type2 in events2) {
            for (i2 = 0, l = events2[type2].length; i2 < l; i2++) {
              jQuery2.event.add(dest, type2, events2[type2][i2]);
            }
          }
        }
      }
      if (dataUser.hasData(src)) {
        udataOld = dataUser.access(src);
        udataCur = jQuery2.extend({}, udataOld);
        dataUser.set(dest, udataCur);
      }
    }
    function fixInput(src, dest) {
      var nodeName2 = dest.nodeName.toLowerCase();
      if (nodeName2 === "input" && rcheckableType.test(src.type)) {
        dest.checked = src.checked;
      } else if (nodeName2 === "input" || nodeName2 === "textarea") {
        dest.defaultValue = src.defaultValue;
      }
    }
    function domManip(collection, args, callback, ignored) {
      args = flat2(args);
      var fragment, first, scripts, hasScripts, node2, doc, i2 = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
      if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
        return collection.each(function(index) {
          var self2 = collection.eq(index);
          if (valueIsFunction) {
            args[0] = value.call(this, index, self2.html());
          }
          domManip(self2, args, callback, ignored);
        });
      }
      if (l) {
        fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
        first = fragment.firstChild;
        if (fragment.childNodes.length === 1) {
          fragment = first;
        }
        if (first || ignored) {
          scripts = jQuery2.map(getAll(fragment, "script"), disableScript);
          hasScripts = scripts.length;
          for (; i2 < l; i2++) {
            node2 = fragment;
            if (i2 !== iNoClone) {
              node2 = jQuery2.clone(node2, true, true);
              if (hasScripts) {
                jQuery2.merge(scripts, getAll(node2, "script"));
              }
            }
            callback.call(collection[i2], node2, i2);
          }
          if (hasScripts) {
            doc = scripts[scripts.length - 1].ownerDocument;
            jQuery2.map(scripts, restoreScript);
            for (i2 = 0; i2 < hasScripts; i2++) {
              node2 = scripts[i2];
              if (rscriptType.test(node2.type || "") && !dataPriv.access(node2, "globalEval") && jQuery2.contains(doc, node2)) {
                if (node2.src && (node2.type || "").toLowerCase() !== "module") {
                  if (jQuery2._evalUrl && !node2.noModule) {
                    jQuery2._evalUrl(node2.src, {
                      nonce: node2.nonce || node2.getAttribute("nonce")
                    }, doc);
                  }
                } else {
                  DOMEval(node2.textContent.replace(rcleanScript, ""), node2, doc);
                }
              }
            }
          }
        }
      }
      return collection;
    }
    function remove2(elem, selector, keepData) {
      var node2, nodes = selector ? jQuery2.filter(selector, elem) : elem, i2 = 0;
      for (; (node2 = nodes[i2]) != null; i2++) {
        if (!keepData && node2.nodeType === 1) {
          jQuery2.cleanData(getAll(node2));
        }
        if (node2.parentNode) {
          if (keepData && isAttached(node2)) {
            setGlobalEval(getAll(node2, "script"));
          }
          node2.parentNode.removeChild(node2);
        }
      }
      return elem;
    }
    jQuery2.extend({
      htmlPrefilter: function(html) {
        return html;
      },
      clone: function(elem, dataAndEvents, deepDataAndEvents) {
        var i2, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
        if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery2.isXMLDoc(elem)) {
          destElements = getAll(clone);
          srcElements = getAll(elem);
          for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
            fixInput(srcElements[i2], destElements[i2]);
          }
        }
        if (dataAndEvents) {
          if (deepDataAndEvents) {
            srcElements = srcElements || getAll(elem);
            destElements = destElements || getAll(clone);
            for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
              cloneCopyEvent(srcElements[i2], destElements[i2]);
            }
          } else {
            cloneCopyEvent(elem, clone);
          }
        }
        destElements = getAll(clone, "script");
        if (destElements.length > 0) {
          setGlobalEval(destElements, !inPage && getAll(elem, "script"));
        }
        return clone;
      },
      cleanData: function(elems) {
        var data, elem, type2, special = jQuery2.event.special, i2 = 0;
        for (; (elem = elems[i2]) !== void 0; i2++) {
          if (acceptData(elem)) {
            if (data = elem[dataPriv.expando]) {
              if (data.events) {
                for (type2 in data.events) {
                  if (special[type2]) {
                    jQuery2.event.remove(elem, type2);
                  } else {
                    jQuery2.removeEvent(elem, type2, data.handle);
                  }
                }
              }
              elem[dataPriv.expando] = void 0;
            }
            if (elem[dataUser.expando]) {
              elem[dataUser.expando] = void 0;
            }
          }
        }
      }
    });
    jQuery2.fn.extend({
      detach: function(selector) {
        return remove2(this, selector, true);
      },
      remove: function(selector) {
        return remove2(this, selector);
      },
      text: function(value) {
        return access(this, function(value2) {
          return value2 === void 0 ? jQuery2.text(this) : this.empty().each(function() {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              this.textContent = value2;
            }
          });
        }, null, value, arguments.length);
      },
      append: function() {
        return domManip(this, arguments, function(elem) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var target2 = manipulationTarget(this, elem);
            target2.appendChild(elem);
          }
        });
      },
      prepend: function() {
        return domManip(this, arguments, function(elem) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var target2 = manipulationTarget(this, elem);
            target2.insertBefore(elem, target2.firstChild);
          }
        });
      },
      before: function() {
        return domManip(this, arguments, function(elem) {
          if (this.parentNode) {
            this.parentNode.insertBefore(elem, this);
          }
        });
      },
      after: function() {
        return domManip(this, arguments, function(elem) {
          if (this.parentNode) {
            this.parentNode.insertBefore(elem, this.nextSibling);
          }
        });
      },
      empty: function() {
        var elem, i2 = 0;
        for (; (elem = this[i2]) != null; i2++) {
          if (elem.nodeType === 1) {
            jQuery2.cleanData(getAll(elem, false));
            elem.textContent = "";
          }
        }
        return this;
      },
      clone: function(dataAndEvents, deepDataAndEvents) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
        return this.map(function() {
          return jQuery2.clone(this, dataAndEvents, deepDataAndEvents);
        });
      },
      html: function(value) {
        return access(this, function(value2) {
          var elem = this[0] || {}, i2 = 0, l = this.length;
          if (value2 === void 0 && elem.nodeType === 1) {
            return elem.innerHTML;
          }
          if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
            value2 = jQuery2.htmlPrefilter(value2);
            try {
              for (; i2 < l; i2++) {
                elem = this[i2] || {};
                if (elem.nodeType === 1) {
                  jQuery2.cleanData(getAll(elem, false));
                  elem.innerHTML = value2;
                }
              }
              elem = 0;
            } catch (e) {
            }
          }
          if (elem) {
            this.empty().append(value2);
          }
        }, null, value, arguments.length);
      },
      replaceWith: function() {
        var ignored = [];
        return domManip(this, arguments, function(elem) {
          var parent = this.parentNode;
          if (jQuery2.inArray(this, ignored) < 0) {
            jQuery2.cleanData(getAll(this));
            if (parent) {
              parent.replaceChild(elem, this);
            }
          }
        }, ignored);
      }
    });
    jQuery2.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(name, original) {
      jQuery2.fn[name] = function(selector) {
        var elems, ret = [], insert = jQuery2(selector), last = insert.length - 1, i2 = 0;
        for (; i2 <= last; i2++) {
          elems = i2 === last ? this : this.clone(true);
          jQuery2(insert[i2])[original](elems);
          push.apply(ret, elems.get());
        }
        return this.pushStack(ret);
      };
    });
    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
    var rcustomProp = /^--/;
    var getStyles = function(elem) {
      var view = elem.ownerDocument.defaultView;
      if (!view || !view.opener) {
        view = window2;
      }
      return view.getComputedStyle(elem);
    };
    var swap = function(elem, options, callback) {
      var ret, name, old = {};
      for (name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }
      ret = callback.call(elem);
      for (name in options) {
        elem.style[name] = old[name];
      }
      return ret;
    };
    var rboxStyle = new RegExp(cssExpand.join("|"), "i");
    (function() {
      function computeStyleTests() {
        if (!div2) {
          return;
        }
        container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
        div2.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
        documentElement.appendChild(container).appendChild(div2);
        var divStyle = window2.getComputedStyle(div2);
        pixelPositionVal = divStyle.top !== "1%";
        reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
        div2.style.right = "60%";
        pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
        boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
        div2.style.position = "absolute";
        scrollboxSizeVal = roundPixelMeasures(div2.offsetWidth / 3) === 12;
        documentElement.removeChild(container);
        div2 = null;
      }
      function roundPixelMeasures(measure) {
        return Math.round(parseFloat(measure));
      }
      var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div2 = document2.createElement("div");
      if (!div2.style) {
        return;
      }
      div2.style.backgroundClip = "content-box";
      div2.cloneNode(true).style.backgroundClip = "";
      support.clearCloneStyle = div2.style.backgroundClip === "content-box";
      jQuery2.extend(support, {
        boxSizingReliable: function() {
          computeStyleTests();
          return boxSizingReliableVal;
        },
        pixelBoxStyles: function() {
          computeStyleTests();
          return pixelBoxStylesVal;
        },
        pixelPosition: function() {
          computeStyleTests();
          return pixelPositionVal;
        },
        reliableMarginLeft: function() {
          computeStyleTests();
          return reliableMarginLeftVal;
        },
        scrollboxSize: function() {
          computeStyleTests();
          return scrollboxSizeVal;
        },
        reliableTrDimensions: function() {
          var table, tr, trChild, trStyle;
          if (reliableTrDimensionsVal == null) {
            table = document2.createElement("table");
            tr = document2.createElement("tr");
            trChild = document2.createElement("div");
            table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
            tr.style.cssText = "box-sizing:content-box;border:1px solid";
            tr.style.height = "1px";
            trChild.style.height = "9px";
            trChild.style.display = "block";
            documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
            trStyle = window2.getComputedStyle(tr);
            reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
            documentElement.removeChild(table);
          }
          return reliableTrDimensionsVal;
        }
      });
    })();
    function curCSS(elem, name, computed) {
      var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
      computed = computed || getStyles(elem);
      if (computed) {
        ret = computed.getPropertyValue(name) || computed[name];
        if (isCustomProp && ret) {
          ret = ret.replace(rtrimCSS, "$1") || void 0;
        }
        if (ret === "" && !isAttached(elem)) {
          ret = jQuery2.style(elem, name);
        }
        if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
          width = style.width;
          minWidth = style.minWidth;
          maxWidth = style.maxWidth;
          style.minWidth = style.maxWidth = style.width = ret;
          ret = computed.width;
          style.width = width;
          style.minWidth = minWidth;
          style.maxWidth = maxWidth;
        }
      }
      return ret !== void 0 ? ret + "" : ret;
    }
    function addGetHookIf(conditionFn, hookFn) {
      return {
        get: function() {
          if (conditionFn()) {
            delete this.get;
            return;
          }
          return (this.get = hookFn).apply(this, arguments);
        }
      };
    }
    var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
    function vendorPropName(name) {
      var capName = name[0].toUpperCase() + name.slice(1), i2 = cssPrefixes.length;
      while (i2--) {
        name = cssPrefixes[i2] + capName;
        if (name in emptyStyle) {
          return name;
        }
      }
    }
    function finalPropName(name) {
      var final = jQuery2.cssProps[name] || vendorProps[name];
      if (final) {
        return final;
      }
      if (name in emptyStyle) {
        return name;
      }
      return vendorProps[name] = vendorPropName(name) || name;
    }
    var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
      letterSpacing: "0",
      fontWeight: "400"
    };
    function setPositiveNumber(_elem, value, subtract) {
      var matches = rcssNum.exec(value);
      return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
    }
    function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
      var i2 = dimension === "width" ? 1 : 0, extra = 0, delta2 = 0, marginDelta = 0;
      if (box === (isBorderBox ? "border" : "content")) {
        return 0;
      }
      for (; i2 < 4; i2 += 2) {
        if (box === "margin") {
          marginDelta += jQuery2.css(elem, box + cssExpand[i2], true, styles);
        }
        if (!isBorderBox) {
          delta2 += jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
          if (box !== "padding") {
            delta2 += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
          } else {
            extra += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
          }
        } else {
          if (box === "content") {
            delta2 -= jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
          }
          if (box !== "margin") {
            delta2 -= jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
          }
        }
      }
      if (!isBorderBox && computedVal >= 0) {
        delta2 += Math.max(0, Math.ceil(
          elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta2 - extra - 0.5
        )) || 0;
      }
      return delta2 + marginDelta;
    }
    function getWidthOrHeight(elem, dimension, extra) {
      var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
      if (rnumnonpx.test(val)) {
        if (!extra) {
          return val;
        }
        val = "auto";
      }
      if ((!support.boxSizingReliable() && isBorderBox || !support.reliableTrDimensions() && nodeName(elem, "tr") || val === "auto" || !parseFloat(val) && jQuery2.css(elem, "display", false, styles) === "inline") && elem.getClientRects().length) {
        isBorderBox = jQuery2.css(elem, "boxSizing", false, styles) === "border-box";
        valueIsBorderBox = offsetProp in elem;
        if (valueIsBorderBox) {
          val = elem[offsetProp];
        }
      }
      val = parseFloat(val) || 0;
      return val + boxModelAdjustment(
        elem,
        dimension,
        extra || (isBorderBox ? "border" : "content"),
        valueIsBorderBox,
        styles,
        val
      ) + "px";
    }
    jQuery2.extend({
      cssHooks: {
        opacity: {
          get: function(elem, computed) {
            if (computed) {
              var ret = curCSS(elem, "opacity");
              return ret === "" ? "1" : ret;
            }
          }
        }
      },
      cssNumber: {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageSlice: true,
        columnCount: true,
        flexGrow: true,
        flexShrink: true,
        fontWeight: true,
        gridArea: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnStart: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowStart: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        scale: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeMiterlimit: true,
        strokeOpacity: true
      },
      cssProps: {},
      style: function(elem, name, value, extra) {
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
          return;
        }
        var ret, type2, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
        if (!isCustomProp) {
          name = finalPropName(origName);
        }
        hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
        if (value !== void 0) {
          type2 = typeof value;
          if (type2 === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
            value = adjustCSS(elem, name, ret);
            type2 = "number";
          }
          if (value == null || value !== value) {
            return;
          }
          if (type2 === "number" && !isCustomProp) {
            value += ret && ret[3] || (jQuery2.cssNumber[origName] ? "" : "px");
          }
          if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
            style[name] = "inherit";
          }
          if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
            if (isCustomProp) {
              style.setProperty(name, value);
            } else {
              style[name] = value;
            }
          }
        } else {
          if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
            return ret;
          }
          return style[name];
        }
      },
      css: function(elem, name, extra, styles) {
        var val, num2, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
        if (!isCustomProp) {
          name = finalPropName(origName);
        }
        hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
        if (hooks && "get" in hooks) {
          val = hooks.get(elem, true, extra);
        }
        if (val === void 0) {
          val = curCSS(elem, name, styles);
        }
        if (val === "normal" && name in cssNormalTransform) {
          val = cssNormalTransform[name];
        }
        if (extra === "" || extra) {
          num2 = parseFloat(val);
          return extra === true || isFinite(num2) ? num2 || 0 : val;
        }
        return val;
      }
    });
    jQuery2.each(["height", "width"], function(_i, dimension) {
      jQuery2.cssHooks[dimension] = {
        get: function(elem, computed, extra) {
          if (computed) {
            return rdisplayswap.test(jQuery2.css(elem, "display")) && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
              return getWidthOrHeight(elem, dimension, extra);
            }) : getWidthOrHeight(elem, dimension, extra);
          }
        },
        set: function(elem, value, extra) {
          var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
            elem,
            dimension,
            extra,
            isBorderBox,
            styles
          ) : 0;
          if (isBorderBox && scrollboxSizeBuggy) {
            subtract -= Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
            );
          }
          if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
            elem.style[dimension] = value;
            value = jQuery2.css(elem, dimension);
          }
          return setPositiveNumber(elem, value, subtract);
        }
      };
    });
    jQuery2.cssHooks.marginLeft = addGetHookIf(
      support.reliableMarginLeft,
      function(elem, computed) {
        if (computed) {
          return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
            return elem.getBoundingClientRect().left;
          })) + "px";
        }
      }
    );
    jQuery2.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(prefix, suffix) {
      jQuery2.cssHooks[prefix + suffix] = {
        expand: function(value) {
          var i2 = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
          for (; i2 < 4; i2++) {
            expanded[prefix + cssExpand[i2] + suffix] = parts[i2] || parts[i2 - 2] || parts[0];
          }
          return expanded;
        }
      };
      if (prefix !== "margin") {
        jQuery2.cssHooks[prefix + suffix].set = setPositiveNumber;
      }
    });
    jQuery2.fn.extend({
      css: function(name, value) {
        return access(this, function(elem, name2, value2) {
          var styles, len, map2 = {}, i2 = 0;
          if (Array.isArray(name2)) {
            styles = getStyles(elem);
            len = name2.length;
            for (; i2 < len; i2++) {
              map2[name2[i2]] = jQuery2.css(elem, name2[i2], false, styles);
            }
            return map2;
          }
          return value2 !== void 0 ? jQuery2.style(elem, name2, value2) : jQuery2.css(elem, name2);
        }, name, value, arguments.length > 1);
      }
    });
    function Tween(elem, options, prop2, end, easing) {
      return new Tween.prototype.init(elem, options, prop2, end, easing);
    }
    jQuery2.Tween = Tween;
    Tween.prototype = {
      constructor: Tween,
      init: function(elem, options, prop2, end, easing, unit) {
        this.elem = elem;
        this.prop = prop2;
        this.easing = easing || jQuery2.easing._default;
        this.options = options;
        this.start = this.now = this.cur();
        this.end = end;
        this.unit = unit || (jQuery2.cssNumber[prop2] ? "" : "px");
      },
      cur: function() {
        var hooks = Tween.propHooks[this.prop];
        return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
      },
      run: function(percent) {
        var eased, hooks = Tween.propHooks[this.prop];
        if (this.options.duration) {
          this.pos = eased = jQuery2.easing[this.easing](
            percent,
            this.options.duration * percent,
            0,
            1,
            this.options.duration
          );
        } else {
          this.pos = eased = percent;
        }
        this.now = (this.end - this.start) * eased + this.start;
        if (this.options.step) {
          this.options.step.call(this.elem, this.now, this);
        }
        if (hooks && hooks.set) {
          hooks.set(this);
        } else {
          Tween.propHooks._default.set(this);
        }
        return this;
      }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
      _default: {
        get: function(tween) {
          var result;
          if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
            return tween.elem[tween.prop];
          }
          result = jQuery2.css(tween.elem, tween.prop, "");
          return !result || result === "auto" ? 0 : result;
        },
        set: function(tween) {
          if (jQuery2.fx.step[tween.prop]) {
            jQuery2.fx.step[tween.prop](tween);
          } else if (tween.elem.nodeType === 1 && (jQuery2.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
            jQuery2.style(tween.elem, tween.prop, tween.now + tween.unit);
          } else {
            tween.elem[tween.prop] = tween.now;
          }
        }
      }
    };
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
      set: function(tween) {
        if (tween.elem.nodeType && tween.elem.parentNode) {
          tween.elem[tween.prop] = tween.now;
        }
      }
    };
    jQuery2.easing = {
      linear: function(p) {
        return p;
      },
      swing: function(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
      },
      _default: "swing"
    };
    jQuery2.fx = Tween.prototype.init;
    jQuery2.fx.step = {};
    var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
    function schedule() {
      if (inProgress) {
        if (document2.hidden === false && window2.requestAnimationFrame) {
          window2.requestAnimationFrame(schedule);
        } else {
          window2.setTimeout(schedule, jQuery2.fx.interval);
        }
        jQuery2.fx.tick();
      }
    }
    function createFxNow() {
      window2.setTimeout(function() {
        fxNow = void 0;
      });
      return fxNow = Date.now();
    }
    function genFx(type2, includeWidth) {
      var which, i2 = 0, attrs = { height: type2 };
      includeWidth = includeWidth ? 1 : 0;
      for (; i2 < 4; i2 += 2 - includeWidth) {
        which = cssExpand[i2];
        attrs["margin" + which] = attrs["padding" + which] = type2;
      }
      if (includeWidth) {
        attrs.opacity = attrs.width = type2;
      }
      return attrs;
    }
    function createTween(value, prop2, animation) {
      var tween, collection = (Animation.tweeners[prop2] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
      for (; index < length; index++) {
        if (tween = collection[index].call(animation, prop2, value)) {
          return tween;
        }
      }
    }
    function defaultPrefilter(elem, props, opts) {
      var prop2, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
      if (!opts.queue) {
        hooks = jQuery2._queueHooks(elem, "fx");
        if (hooks.unqueued == null) {
          hooks.unqueued = 0;
          oldfire = hooks.empty.fire;
          hooks.empty.fire = function() {
            if (!hooks.unqueued) {
              oldfire();
            }
          };
        }
        hooks.unqueued++;
        anim.always(function() {
          anim.always(function() {
            hooks.unqueued--;
            if (!jQuery2.queue(elem, "fx").length) {
              hooks.empty.fire();
            }
          });
        });
      }
      for (prop2 in props) {
        value = props[prop2];
        if (rfxtypes.test(value)) {
          delete props[prop2];
          toggle = toggle || value === "toggle";
          if (value === (hidden ? "hide" : "show")) {
            if (value === "show" && dataShow && dataShow[prop2] !== void 0) {
              hidden = true;
            } else {
              continue;
            }
          }
          orig[prop2] = dataShow && dataShow[prop2] || jQuery2.style(elem, prop2);
        }
      }
      propTween = !jQuery2.isEmptyObject(props);
      if (!propTween && jQuery2.isEmptyObject(orig)) {
        return;
      }
      if (isBox && elem.nodeType === 1) {
        opts.overflow = [style.overflow, style.overflowX, style.overflowY];
        restoreDisplay = dataShow && dataShow.display;
        if (restoreDisplay == null) {
          restoreDisplay = dataPriv.get(elem, "display");
        }
        display = jQuery2.css(elem, "display");
        if (display === "none") {
          if (restoreDisplay) {
            display = restoreDisplay;
          } else {
            showHide([elem], true);
            restoreDisplay = elem.style.display || restoreDisplay;
            display = jQuery2.css(elem, "display");
            showHide([elem]);
          }
        }
        if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
          if (jQuery2.css(elem, "float") === "none") {
            if (!propTween) {
              anim.done(function() {
                style.display = restoreDisplay;
              });
              if (restoreDisplay == null) {
                display = style.display;
                restoreDisplay = display === "none" ? "" : display;
              }
            }
            style.display = "inline-block";
          }
        }
      }
      if (opts.overflow) {
        style.overflow = "hidden";
        anim.always(function() {
          style.overflow = opts.overflow[0];
          style.overflowX = opts.overflow[1];
          style.overflowY = opts.overflow[2];
        });
      }
      propTween = false;
      for (prop2 in orig) {
        if (!propTween) {
          if (dataShow) {
            if ("hidden" in dataShow) {
              hidden = dataShow.hidden;
            }
          } else {
            dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
          }
          if (toggle) {
            dataShow.hidden = !hidden;
          }
          if (hidden) {
            showHide([elem], true);
          }
          anim.done(function() {
            if (!hidden) {
              showHide([elem]);
            }
            dataPriv.remove(elem, "fxshow");
            for (prop2 in orig) {
              jQuery2.style(elem, prop2, orig[prop2]);
            }
          });
        }
        propTween = createTween(hidden ? dataShow[prop2] : 0, prop2, anim);
        if (!(prop2 in dataShow)) {
          dataShow[prop2] = propTween.start;
          if (hidden) {
            propTween.end = propTween.start;
            propTween.start = 0;
          }
        }
      }
    }
    function propFilter(props, specialEasing) {
      var index, name, easing, value, hooks;
      for (index in props) {
        name = camelCase(index);
        easing = specialEasing[name];
        value = props[index];
        if (Array.isArray(value)) {
          easing = value[1];
          value = props[index] = value[0];
        }
        if (index !== name) {
          props[name] = value;
          delete props[index];
        }
        hooks = jQuery2.cssHooks[name];
        if (hooks && "expand" in hooks) {
          value = hooks.expand(value);
          delete props[name];
          for (index in value) {
            if (!(index in props)) {
              props[index] = value[index];
              specialEasing[index] = easing;
            }
          }
        } else {
          specialEasing[name] = easing;
        }
      }
    }
    function Animation(elem, properties, options) {
      var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery2.Deferred().always(function() {
        delete tick.elem;
      }), tick = function() {
        if (stopped) {
          return false;
        }
        var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
        for (; index2 < length2; index2++) {
          animation.tweens[index2].run(percent);
        }
        deferred.notifyWith(elem, [animation, percent, remaining]);
        if (percent < 1 && length2) {
          return remaining;
        }
        if (!length2) {
          deferred.notifyWith(elem, [animation, 1, 0]);
        }
        deferred.resolveWith(elem, [animation]);
        return false;
      }, animation = deferred.promise({
        elem,
        props: jQuery2.extend({}, properties),
        opts: jQuery2.extend(true, {
          specialEasing: {},
          easing: jQuery2.easing._default
        }, options),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function(prop2, end) {
          var tween = jQuery2.Tween(
            elem,
            animation.opts,
            prop2,
            end,
            animation.opts.specialEasing[prop2] || animation.opts.easing
          );
          animation.tweens.push(tween);
          return tween;
        },
        stop: function(gotoEnd) {
          var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
          if (stopped) {
            return this;
          }
          stopped = true;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(1);
          }
          if (gotoEnd) {
            deferred.notifyWith(elem, [animation, 1, 0]);
            deferred.resolveWith(elem, [animation, gotoEnd]);
          } else {
            deferred.rejectWith(elem, [animation, gotoEnd]);
          }
          return this;
        }
      }), props = animation.props;
      propFilter(props, animation.opts.specialEasing);
      for (; index < length; index++) {
        result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
        if (result) {
          if (isFunction(result.stop)) {
            jQuery2._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
          }
          return result;
        }
      }
      jQuery2.map(props, createTween, animation);
      if (isFunction(animation.opts.start)) {
        animation.opts.start.call(elem, animation);
      }
      animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
      jQuery2.fx.timer(
        jQuery2.extend(tick, {
          elem,
          anim: animation,
          queue: animation.opts.queue
        })
      );
      return animation;
    }
    jQuery2.Animation = jQuery2.extend(Animation, {
      tweeners: {
        "*": [function(prop2, value) {
          var tween = this.createTween(prop2, value);
          adjustCSS(tween.elem, prop2, rcssNum.exec(value), tween);
          return tween;
        }]
      },
      tweener: function(props, callback) {
        if (isFunction(props)) {
          callback = props;
          props = ["*"];
        } else {
          props = props.match(rnothtmlwhite);
        }
        var prop2, index = 0, length = props.length;
        for (; index < length; index++) {
          prop2 = props[index];
          Animation.tweeners[prop2] = Animation.tweeners[prop2] || [];
          Animation.tweeners[prop2].unshift(callback);
        }
      },
      prefilters: [defaultPrefilter],
      prefilter: function(callback, prepend) {
        if (prepend) {
          Animation.prefilters.unshift(callback);
        } else {
          Animation.prefilters.push(callback);
        }
      }
    });
    jQuery2.speed = function(speed, easing, fn2) {
      var opt = speed && typeof speed === "object" ? jQuery2.extend({}, speed) : {
        complete: fn2 || !fn2 && easing || isFunction(speed) && speed,
        duration: speed,
        easing: fn2 && easing || easing && !isFunction(easing) && easing
      };
      if (jQuery2.fx.off) {
        opt.duration = 0;
      } else {
        if (typeof opt.duration !== "number") {
          if (opt.duration in jQuery2.fx.speeds) {
            opt.duration = jQuery2.fx.speeds[opt.duration];
          } else {
            opt.duration = jQuery2.fx.speeds._default;
          }
        }
      }
      if (opt.queue == null || opt.queue === true) {
        opt.queue = "fx";
      }
      opt.old = opt.complete;
      opt.complete = function() {
        if (isFunction(opt.old)) {
          opt.old.call(this);
        }
        if (opt.queue) {
          jQuery2.dequeue(this, opt.queue);
        }
      };
      return opt;
    };
    jQuery2.fn.extend({
      fadeTo: function(speed, to, easing, callback) {
        return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
      },
      animate: function(prop2, speed, easing, callback) {
        var empty2 = jQuery2.isEmptyObject(prop2), optall = jQuery2.speed(speed, easing, callback), doAnimation = function() {
          var anim = Animation(this, jQuery2.extend({}, prop2), optall);
          if (empty2 || dataPriv.get(this, "finish")) {
            anim.stop(true);
          }
        };
        doAnimation.finish = doAnimation;
        return empty2 || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
      },
      stop: function(type2, clearQueue, gotoEnd) {
        var stopQueue = function(hooks) {
          var stop = hooks.stop;
          delete hooks.stop;
          stop(gotoEnd);
        };
        if (typeof type2 !== "string") {
          gotoEnd = clearQueue;
          clearQueue = type2;
          type2 = void 0;
        }
        if (clearQueue) {
          this.queue(type2 || "fx", []);
        }
        return this.each(function() {
          var dequeue = true, index = type2 != null && type2 + "queueHooks", timers = jQuery2.timers, data = dataPriv.get(this);
          if (index) {
            if (data[index] && data[index].stop) {
              stopQueue(data[index]);
            }
          } else {
            for (index in data) {
              if (data[index] && data[index].stop && rrun.test(index)) {
                stopQueue(data[index]);
              }
            }
          }
          for (index = timers.length; index--; ) {
            if (timers[index].elem === this && (type2 == null || timers[index].queue === type2)) {
              timers[index].anim.stop(gotoEnd);
              dequeue = false;
              timers.splice(index, 1);
            }
          }
          if (dequeue || !gotoEnd) {
            jQuery2.dequeue(this, type2);
          }
        });
      },
      finish: function(type2) {
        if (type2 !== false) {
          type2 = type2 || "fx";
        }
        return this.each(function() {
          var index, data = dataPriv.get(this), queue = data[type2 + "queue"], hooks = data[type2 + "queueHooks"], timers = jQuery2.timers, length = queue ? queue.length : 0;
          data.finish = true;
          jQuery2.queue(this, type2, []);
          if (hooks && hooks.stop) {
            hooks.stop.call(this, true);
          }
          for (index = timers.length; index--; ) {
            if (timers[index].elem === this && timers[index].queue === type2) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
          for (index = 0; index < length; index++) {
            if (queue[index] && queue[index].finish) {
              queue[index].finish.call(this);
            }
          }
          delete data.finish;
        });
      }
    });
    jQuery2.each(["toggle", "show", "hide"], function(_i, name) {
      var cssFn = jQuery2.fn[name];
      jQuery2.fn[name] = function(speed, easing, callback) {
        return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
      };
    });
    jQuery2.each({
      slideDown: genFx("show"),
      slideUp: genFx("hide"),
      slideToggle: genFx("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(name, props) {
      jQuery2.fn[name] = function(speed, easing, callback) {
        return this.animate(props, speed, easing, callback);
      };
    });
    jQuery2.timers = [];
    jQuery2.fx.tick = function() {
      var timer, i2 = 0, timers = jQuery2.timers;
      fxNow = Date.now();
      for (; i2 < timers.length; i2++) {
        timer = timers[i2];
        if (!timer() && timers[i2] === timer) {
          timers.splice(i2--, 1);
        }
      }
      if (!timers.length) {
        jQuery2.fx.stop();
      }
      fxNow = void 0;
    };
    jQuery2.fx.timer = function(timer) {
      jQuery2.timers.push(timer);
      jQuery2.fx.start();
    };
    jQuery2.fx.interval = 13;
    jQuery2.fx.start = function() {
      if (inProgress) {
        return;
      }
      inProgress = true;
      schedule();
    };
    jQuery2.fx.stop = function() {
      inProgress = null;
    };
    jQuery2.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    };
    jQuery2.fn.delay = function(time, type2) {
      time = jQuery2.fx ? jQuery2.fx.speeds[time] || time : time;
      type2 = type2 || "fx";
      return this.queue(type2, function(next, hooks) {
        var timeout = window2.setTimeout(next, time);
        hooks.stop = function() {
          window2.clearTimeout(timeout);
        };
      });
    };
    (function() {
      var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
      input.type = "checkbox";
      support.checkOn = input.value !== "";
      support.optSelected = opt.selected;
      input = document2.createElement("input");
      input.value = "t";
      input.type = "radio";
      support.radioValue = input.value === "t";
    })();
    var boolHook, attrHandle = jQuery2.expr.attrHandle;
    jQuery2.fn.extend({
      attr: function(name, value) {
        return access(this, jQuery2.attr, name, value, arguments.length > 1);
      },
      removeAttr: function(name) {
        return this.each(function() {
          jQuery2.removeAttr(this, name);
        });
      }
    });
    jQuery2.extend({
      attr: function(elem, name, value) {
        var ret, hooks, nType = elem.nodeType;
        if (nType === 3 || nType === 8 || nType === 2) {
          return;
        }
        if (typeof elem.getAttribute === "undefined") {
          return jQuery2.prop(elem, name, value);
        }
        if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
          hooks = jQuery2.attrHooks[name.toLowerCase()] || (jQuery2.expr.match.bool.test(name) ? boolHook : void 0);
        }
        if (value !== void 0) {
          if (value === null) {
            jQuery2.removeAttr(elem, name);
            return;
          }
          if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
            return ret;
          }
          elem.setAttribute(name, value + "");
          return value;
        }
        if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
          return ret;
        }
        ret = jQuery2.find.attr(elem, name);
        return ret == null ? void 0 : ret;
      },
      attrHooks: {
        type: {
          set: function(elem, value) {
            if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
              var val = elem.value;
              elem.setAttribute("type", value);
              if (val) {
                elem.value = val;
              }
              return value;
            }
          }
        }
      },
      removeAttr: function(elem, value) {
        var name, i2 = 0, attrNames = value && value.match(rnothtmlwhite);
        if (attrNames && elem.nodeType === 1) {
          while (name = attrNames[i2++]) {
            elem.removeAttribute(name);
          }
        }
      }
    });
    boolHook = {
      set: function(elem, value, name) {
        if (value === false) {
          jQuery2.removeAttr(elem, name);
        } else {
          elem.setAttribute(name, name);
        }
        return name;
      }
    };
    jQuery2.each(jQuery2.expr.match.bool.source.match(/\w+/g), function(_i, name) {
      var getter = attrHandle[name] || jQuery2.find.attr;
      attrHandle[name] = function(elem, name2, isXML) {
        var ret, handle, lowercaseName = name2.toLowerCase();
        if (!isXML) {
          handle = attrHandle[lowercaseName];
          attrHandle[lowercaseName] = ret;
          ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
          attrHandle[lowercaseName] = handle;
        }
        return ret;
      };
    });
    var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
    jQuery2.fn.extend({
      prop: function(name, value) {
        return access(this, jQuery2.prop, name, value, arguments.length > 1);
      },
      removeProp: function(name) {
        return this.each(function() {
          delete this[jQuery2.propFix[name] || name];
        });
      }
    });
    jQuery2.extend({
      prop: function(elem, name, value) {
        var ret, hooks, nType = elem.nodeType;
        if (nType === 3 || nType === 8 || nType === 2) {
          return;
        }
        if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
          name = jQuery2.propFix[name] || name;
          hooks = jQuery2.propHooks[name];
        }
        if (value !== void 0) {
          if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
            return ret;
          }
          return elem[name] = value;
        }
        if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
          return ret;
        }
        return elem[name];
      },
      propHooks: {
        tabIndex: {
          get: function(elem) {
            var tabindex = jQuery2.find.attr(elem, "tabindex");
            if (tabindex) {
              return parseInt(tabindex, 10);
            }
            if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
              return 0;
            }
            return -1;
          }
        }
      },
      propFix: {
        "for": "htmlFor",
        "class": "className"
      }
    });
    if (!support.optSelected) {
      jQuery2.propHooks.selected = {
        get: function(elem) {
          var parent = elem.parentNode;
          if (parent && parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
          return null;
        },
        set: function(elem) {
          var parent = elem.parentNode;
          if (parent) {
            parent.selectedIndex;
            if (parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
          }
        }
      };
    }
    jQuery2.each([
      "tabIndex",
      "readOnly",
      "maxLength",
      "cellSpacing",
      "cellPadding",
      "rowSpan",
      "colSpan",
      "useMap",
      "frameBorder",
      "contentEditable"
    ], function() {
      jQuery2.propFix[this.toLowerCase()] = this;
    });
    function stripAndCollapse(value) {
      var tokens = value.match(rnothtmlwhite) || [];
      return tokens.join(" ");
    }
    function getClass(elem) {
      return elem.getAttribute && elem.getAttribute("class") || "";
    }
    function classesToArray(value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "string") {
        return value.match(rnothtmlwhite) || [];
      }
      return [];
    }
    jQuery2.fn.extend({
      addClass: function(value) {
        var classNames, cur, curValue, className, i2, finalValue;
        if (isFunction(value)) {
          return this.each(function(j2) {
            jQuery2(this).addClass(value.call(this, j2, getClass(this)));
          });
        }
        classNames = classesToArray(value);
        if (classNames.length) {
          return this.each(function() {
            curValue = getClass(this);
            cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
            if (cur) {
              for (i2 = 0; i2 < classNames.length; i2++) {
                className = classNames[i2];
                if (cur.indexOf(" " + className + " ") < 0) {
                  cur += className + " ";
                }
              }
              finalValue = stripAndCollapse(cur);
              if (curValue !== finalValue) {
                this.setAttribute("class", finalValue);
              }
            }
          });
        }
        return this;
      },
      removeClass: function(value) {
        var classNames, cur, curValue, className, i2, finalValue;
        if (isFunction(value)) {
          return this.each(function(j2) {
            jQuery2(this).removeClass(value.call(this, j2, getClass(this)));
          });
        }
        if (!arguments.length) {
          return this.attr("class", "");
        }
        classNames = classesToArray(value);
        if (classNames.length) {
          return this.each(function() {
            curValue = getClass(this);
            cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
            if (cur) {
              for (i2 = 0; i2 < classNames.length; i2++) {
                className = classNames[i2];
                while (cur.indexOf(" " + className + " ") > -1) {
                  cur = cur.replace(" " + className + " ", " ");
                }
              }
              finalValue = stripAndCollapse(cur);
              if (curValue !== finalValue) {
                this.setAttribute("class", finalValue);
              }
            }
          });
        }
        return this;
      },
      toggleClass: function(value, stateVal) {
        var classNames, className, i2, self2, type2 = typeof value, isValidValue = type2 === "string" || Array.isArray(value);
        if (isFunction(value)) {
          return this.each(function(i3) {
            jQuery2(this).toggleClass(
              value.call(this, i3, getClass(this), stateVal),
              stateVal
            );
          });
        }
        if (typeof stateVal === "boolean" && isValidValue) {
          return stateVal ? this.addClass(value) : this.removeClass(value);
        }
        classNames = classesToArray(value);
        return this.each(function() {
          if (isValidValue) {
            self2 = jQuery2(this);
            for (i2 = 0; i2 < classNames.length; i2++) {
              className = classNames[i2];
              if (self2.hasClass(className)) {
                self2.removeClass(className);
              } else {
                self2.addClass(className);
              }
            }
          } else if (value === void 0 || type2 === "boolean") {
            className = getClass(this);
            if (className) {
              dataPriv.set(this, "__className__", className);
            }
            if (this.setAttribute) {
              this.setAttribute(
                "class",
                className || value === false ? "" : dataPriv.get(this, "__className__") || ""
              );
            }
          }
        });
      },
      hasClass: function(selector) {
        var className, elem, i2 = 0;
        className = " " + selector + " ";
        while (elem = this[i2++]) {
          if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
            return true;
          }
        }
        return false;
      }
    });
    var rreturn = /\r/g;
    jQuery2.fn.extend({
      val: function(value) {
        var hooks, ret, valueIsFunction, elem = this[0];
        if (!arguments.length) {
          if (elem) {
            hooks = jQuery2.valHooks[elem.type] || jQuery2.valHooks[elem.nodeName.toLowerCase()];
            if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
              return ret;
            }
            ret = elem.value;
            if (typeof ret === "string") {
              return ret.replace(rreturn, "");
            }
            return ret == null ? "" : ret;
          }
          return;
        }
        valueIsFunction = isFunction(value);
        return this.each(function(i2) {
          var val;
          if (this.nodeType !== 1) {
            return;
          }
          if (valueIsFunction) {
            val = value.call(this, i2, jQuery2(this).val());
          } else {
            val = value;
          }
          if (val == null) {
            val = "";
          } else if (typeof val === "number") {
            val += "";
          } else if (Array.isArray(val)) {
            val = jQuery2.map(val, function(value2) {
              return value2 == null ? "" : value2 + "";
            });
          }
          hooks = jQuery2.valHooks[this.type] || jQuery2.valHooks[this.nodeName.toLowerCase()];
          if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
            this.value = val;
          }
        });
      }
    });
    jQuery2.extend({
      valHooks: {
        option: {
          get: function(elem) {
            var val = jQuery2.find.attr(elem, "value");
            return val != null ? val : stripAndCollapse(jQuery2.text(elem));
          }
        },
        select: {
          get: function(elem) {
            var value, option, i2, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max2 = one ? index + 1 : options.length;
            if (index < 0) {
              i2 = max2;
            } else {
              i2 = one ? index : 0;
            }
            for (; i2 < max2; i2++) {
              option = options[i2];
              if ((option.selected || i2 === index) && !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                value = jQuery2(option).val();
                if (one) {
                  return value;
                }
                values.push(value);
              }
            }
            return values;
          },
          set: function(elem, value) {
            var optionSet, option, options = elem.options, values = jQuery2.makeArray(value), i2 = options.length;
            while (i2--) {
              option = options[i2];
              if (option.selected = jQuery2.inArray(jQuery2.valHooks.option.get(option), values) > -1) {
                optionSet = true;
              }
            }
            if (!optionSet) {
              elem.selectedIndex = -1;
            }
            return values;
          }
        }
      }
    });
    jQuery2.each(["radio", "checkbox"], function() {
      jQuery2.valHooks[this] = {
        set: function(elem, value) {
          if (Array.isArray(value)) {
            return elem.checked = jQuery2.inArray(jQuery2(elem).val(), value) > -1;
          }
        }
      };
      if (!support.checkOn) {
        jQuery2.valHooks[this].get = function(elem) {
          return elem.getAttribute("value") === null ? "on" : elem.value;
        };
      }
    });
    var location = window2.location;
    var nonce = { guid: Date.now() };
    var rquery = /\?/;
    jQuery2.parseXML = function(data) {
      var xml, parserErrorElem;
      if (!data || typeof data !== "string") {
        return null;
      }
      try {
        xml = new window2.DOMParser().parseFromString(data, "text/xml");
      } catch (e) {
      }
      parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
      if (!xml || parserErrorElem) {
        jQuery2.error("Invalid XML: " + (parserErrorElem ? jQuery2.map(parserErrorElem.childNodes, function(el2) {
          return el2.textContent;
        }).join("\n") : data));
      }
      return xml;
    };
    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
      e.stopPropagation();
    };
    jQuery2.extend(jQuery2.event, {
      trigger: function(event, data, elem, onlyHandlers) {
        var i2, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type2 = hasOwn2.call(event, "type") ? event.type : event, namespaces = hasOwn2.call(event, "namespace") ? event.namespace.split(".") : [];
        cur = lastElement = tmp = elem = elem || document2;
        if (elem.nodeType === 3 || elem.nodeType === 8) {
          return;
        }
        if (rfocusMorph.test(type2 + jQuery2.event.triggered)) {
          return;
        }
        if (type2.indexOf(".") > -1) {
          namespaces = type2.split(".");
          type2 = namespaces.shift();
          namespaces.sort();
        }
        ontype = type2.indexOf(":") < 0 && "on" + type2;
        event = event[jQuery2.expando] ? event : new jQuery2.Event(type2, typeof event === "object" && event);
        event.isTrigger = onlyHandlers ? 2 : 3;
        event.namespace = namespaces.join(".");
        event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
        event.result = void 0;
        if (!event.target) {
          event.target = elem;
        }
        data = data == null ? [event] : jQuery2.makeArray(data, [event]);
        special = jQuery2.event.special[type2] || {};
        if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
          return;
        }
        if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
          bubbleType = special.delegateType || type2;
          if (!rfocusMorph.test(bubbleType + type2)) {
            cur = cur.parentNode;
          }
          for (; cur; cur = cur.parentNode) {
            eventPath.push(cur);
            tmp = cur;
          }
          if (tmp === (elem.ownerDocument || document2)) {
            eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
          }
        }
        i2 = 0;
        while ((cur = eventPath[i2++]) && !event.isPropagationStopped()) {
          lastElement = cur;
          event.type = i2 > 1 ? bubbleType : special.bindType || type2;
          handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
          if (handle) {
            handle.apply(cur, data);
          }
          handle = ontype && cur[ontype];
          if (handle && handle.apply && acceptData(cur)) {
            event.result = handle.apply(cur, data);
            if (event.result === false) {
              event.preventDefault();
            }
          }
        }
        event.type = type2;
        if (!onlyHandlers && !event.isDefaultPrevented()) {
          if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
            if (ontype && isFunction(elem[type2]) && !isWindow(elem)) {
              tmp = elem[ontype];
              if (tmp) {
                elem[ontype] = null;
              }
              jQuery2.event.triggered = type2;
              if (event.isPropagationStopped()) {
                lastElement.addEventListener(type2, stopPropagationCallback);
              }
              elem[type2]();
              if (event.isPropagationStopped()) {
                lastElement.removeEventListener(type2, stopPropagationCallback);
              }
              jQuery2.event.triggered = void 0;
              if (tmp) {
                elem[ontype] = tmp;
              }
            }
          }
        }
        return event.result;
      },
      simulate: function(type2, elem, event) {
        var e = jQuery2.extend(
          new jQuery2.Event(),
          event,
          {
            type: type2,
            isSimulated: true
          }
        );
        jQuery2.event.trigger(e, null, elem);
      }
    });
    jQuery2.fn.extend({
      trigger: function(type2, data) {
        return this.each(function() {
          jQuery2.event.trigger(type2, data, this);
        });
      },
      triggerHandler: function(type2, data) {
        var elem = this[0];
        if (elem) {
          return jQuery2.event.trigger(type2, data, elem, true);
        }
      }
    });
    var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    function buildParams(prefix, obj, traditional, add) {
      var name;
      if (Array.isArray(obj)) {
        jQuery2.each(obj, function(i2, v) {
          if (traditional || rbracket.test(prefix)) {
            add(prefix, v);
          } else {
            buildParams(
              prefix + "[" + (typeof v === "object" && v != null ? i2 : "") + "]",
              v,
              traditional,
              add
            );
          }
        });
      } else if (!traditional && toType(obj) === "object") {
        for (name in obj) {
          buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }
      } else {
        add(prefix, obj);
      }
    }
    jQuery2.param = function(a, traditional) {
      var prefix, s = [], add = function(key, valueOrFunction) {
        var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
      };
      if (a == null) {
        return "";
      }
      if (Array.isArray(a) || a.jquery && !jQuery2.isPlainObject(a)) {
        jQuery2.each(a, function() {
          add(this.name, this.value);
        });
      } else {
        for (prefix in a) {
          buildParams(prefix, a[prefix], traditional, add);
        }
      }
      return s.join("&");
    };
    jQuery2.fn.extend({
      serialize: function() {
        return jQuery2.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var elements = jQuery2.prop(this, "elements");
          return elements ? jQuery2.makeArray(elements) : this;
        }).filter(function() {
          var type2 = this.type;
          return this.name && !jQuery2(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type2) && (this.checked || !rcheckableType.test(type2));
        }).map(function(_i, elem) {
          var val = jQuery2(this).val();
          if (val == null) {
            return null;
          }
          if (Array.isArray(val)) {
            return jQuery2.map(val, function(val2) {
              return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
            });
          }
          return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
        }).get();
      }
    });
    var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
    originAnchor.href = location.href;
    function addToPrefiltersOrTransports(structure) {
      return function(dataTypeExpression, func) {
        if (typeof dataTypeExpression !== "string") {
          func = dataTypeExpression;
          dataTypeExpression = "*";
        }
        var dataType, i2 = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
        if (isFunction(func)) {
          while (dataType = dataTypes[i2++]) {
            if (dataType[0] === "+") {
              dataType = dataType.slice(1) || "*";
              (structure[dataType] = structure[dataType] || []).unshift(func);
            } else {
              (structure[dataType] = structure[dataType] || []).push(func);
            }
          }
        }
      };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
      var inspected = {}, seekingTransport = structure === transports;
      function inspect(dataType) {
        var selected;
        inspected[dataType] = true;
        jQuery2.each(structure[dataType] || [], function(_, prefilterOrFactory) {
          var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
          if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
            options.dataTypes.unshift(dataTypeOrTransport);
            inspect(dataTypeOrTransport);
            return false;
          } else if (seekingTransport) {
            return !(selected = dataTypeOrTransport);
          }
        });
        return selected;
      }
      return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }
    function ajaxExtend(target2, src) {
      var key, deep, flatOptions = jQuery2.ajaxSettings.flatOptions || {};
      for (key in src) {
        if (src[key] !== void 0) {
          (flatOptions[key] ? target2 : deep || (deep = {}))[key] = src[key];
        }
      }
      if (deep) {
        jQuery2.extend(true, target2, deep);
      }
      return target2;
    }
    function ajaxHandleResponses(s, jqXHR, responses) {
      var ct, type2, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
      while (dataTypes[0] === "*") {
        dataTypes.shift();
        if (ct === void 0) {
          ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
        }
      }
      if (ct) {
        for (type2 in contents) {
          if (contents[type2] && contents[type2].test(ct)) {
            dataTypes.unshift(type2);
            break;
          }
        }
      }
      if (dataTypes[0] in responses) {
        finalDataType = dataTypes[0];
      } else {
        for (type2 in responses) {
          if (!dataTypes[0] || s.converters[type2 + " " + dataTypes[0]]) {
            finalDataType = type2;
            break;
          }
          if (!firstDataType) {
            firstDataType = type2;
          }
        }
        finalDataType = finalDataType || firstDataType;
      }
      if (finalDataType) {
        if (finalDataType !== dataTypes[0]) {
          dataTypes.unshift(finalDataType);
        }
        return responses[finalDataType];
      }
    }
    function ajaxConvert(s, response, jqXHR, isSuccess) {
      var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
      if (dataTypes[1]) {
        for (conv in s.converters) {
          converters[conv.toLowerCase()] = s.converters[conv];
        }
      }
      current = dataTypes.shift();
      while (current) {
        if (s.responseFields[current]) {
          jqXHR[s.responseFields[current]] = response;
        }
        if (!prev && isSuccess && s.dataFilter) {
          response = s.dataFilter(response, s.dataType);
        }
        prev = current;
        current = dataTypes.shift();
        if (current) {
          if (current === "*") {
            current = prev;
          } else if (prev !== "*" && prev !== current) {
            conv = converters[prev + " " + current] || converters["* " + current];
            if (!conv) {
              for (conv2 in converters) {
                tmp = conv2.split(" ");
                if (tmp[1] === current) {
                  conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                  if (conv) {
                    if (conv === true) {
                      conv = converters[conv2];
                    } else if (converters[conv2] !== true) {
                      current = tmp[0];
                      dataTypes.unshift(tmp[1]);
                    }
                    break;
                  }
                }
              }
            }
            if (conv !== true) {
              if (conv && s.throws) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (e) {
                  return {
                    state: "parsererror",
                    error: conv ? e : "No conversion from " + prev + " to " + current
                  };
                }
              }
            }
          }
        }
      }
      return { state: "success", data: response };
    }
    jQuery2.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: location.href,
        type: "GET",
        isLocal: rlocalProtocol.test(location.protocol),
        global: true,
        processData: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": allTypes,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: {
          xml: /\bxml\b/,
          html: /\bhtml/,
          json: /\bjson\b/
        },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        converters: {
          "* text": String,
          "text html": true,
          "text json": JSON.parse,
          "text xml": jQuery2.parseXML
        },
        flatOptions: {
          url: true,
          context: true
        }
      },
      ajaxSetup: function(target2, settings) {
        return settings ? ajaxExtend(ajaxExtend(target2, jQuery2.ajaxSettings), settings) : ajaxExtend(jQuery2.ajaxSettings, target2);
      },
      ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
      ajaxTransport: addToPrefiltersOrTransports(transports),
      ajax: function(url, options) {
        if (typeof url === "object") {
          options = url;
          url = void 0;
        }
        options = options || {};
        var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i2, uncached, s = jQuery2.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery2(callbackContext) : jQuery2.event, deferred = jQuery2.Deferred(), completeDeferred = jQuery2.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
          readyState: 0,
          getResponseHeader: function(key) {
            var match;
            if (completed2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while (match = rheaders.exec(responseHeadersString)) {
                  responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                }
              }
              match = responseHeaders[key.toLowerCase() + " "];
            }
            return match == null ? null : match.join(", ");
          },
          getAllResponseHeaders: function() {
            return completed2 ? responseHeadersString : null;
          },
          setRequestHeader: function(name, value) {
            if (completed2 == null) {
              name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          overrideMimeType: function(type2) {
            if (completed2 == null) {
              s.mimeType = type2;
            }
            return this;
          },
          statusCode: function(map2) {
            var code;
            if (map2) {
              if (completed2) {
                jqXHR.always(map2[jqXHR.status]);
              } else {
                for (code in map2) {
                  statusCode[code] = [statusCode[code], map2[code]];
                }
              }
            }
            return this;
          },
          abort: function(statusText) {
            var finalText = statusText || strAbort;
            if (transport) {
              transport.abort(finalText);
            }
            done(0, finalText);
            return this;
          }
        };
        deferred.promise(jqXHR);
        s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
        s.type = options.method || options.type || s.method || s.type;
        s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
        if (s.crossDomain == null) {
          urlAnchor = document2.createElement("a");
          try {
            urlAnchor.href = s.url;
            urlAnchor.href = urlAnchor.href;
            s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
          } catch (e) {
            s.crossDomain = true;
          }
        }
        if (s.data && s.processData && typeof s.data !== "string") {
          s.data = jQuery2.param(s.data, s.traditional);
        }
        inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
        if (completed2) {
          return jqXHR;
        }
        fireGlobals = jQuery2.event && s.global;
        if (fireGlobals && jQuery2.active++ === 0) {
          jQuery2.event.trigger("ajaxStart");
        }
        s.type = s.type.toUpperCase();
        s.hasContent = !rnoContent.test(s.type);
        cacheURL = s.url.replace(rhash, "");
        if (!s.hasContent) {
          uncached = s.url.slice(cacheURL.length);
          if (s.data && (s.processData || typeof s.data === "string")) {
            cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
            delete s.data;
          }
          if (s.cache === false) {
            cacheURL = cacheURL.replace(rantiCache, "$1");
            uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
          }
          s.url = cacheURL + uncached;
        } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
          s.data = s.data.replace(r20, "+");
        }
        if (s.ifModified) {
          if (jQuery2.lastModified[cacheURL]) {
            jqXHR.setRequestHeader("If-Modified-Since", jQuery2.lastModified[cacheURL]);
          }
          if (jQuery2.etag[cacheURL]) {
            jqXHR.setRequestHeader("If-None-Match", jQuery2.etag[cacheURL]);
          }
        }
        if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
          jqXHR.setRequestHeader("Content-Type", s.contentType);
        }
        jqXHR.setRequestHeader(
          "Accept",
          s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
        );
        for (i2 in s.headers) {
          jqXHR.setRequestHeader(i2, s.headers[i2]);
        }
        if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
          return jqXHR.abort();
        }
        strAbort = "abort";
        completeDeferred.add(s.complete);
        jqXHR.done(s.success);
        jqXHR.fail(s.error);
        transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
        if (!transport) {
          done(-1, "No Transport");
        } else {
          jqXHR.readyState = 1;
          if (fireGlobals) {
            globalEventContext.trigger("ajaxSend", [jqXHR, s]);
          }
          if (completed2) {
            return jqXHR;
          }
          if (s.async && s.timeout > 0) {
            timeoutTimer = window2.setTimeout(function() {
              jqXHR.abort("timeout");
            }, s.timeout);
          }
          try {
            completed2 = false;
            transport.send(requestHeaders, done);
          } catch (e) {
            if (completed2) {
              throw e;
            }
            done(-1, e);
          }
        }
        function done(status, nativeStatusText, responses, headers) {
          var isSuccess, success, error, response, modified, statusText = nativeStatusText;
          if (completed2) {
            return;
          }
          completed2 = true;
          if (timeoutTimer) {
            window2.clearTimeout(timeoutTimer);
          }
          transport = void 0;
          responseHeadersString = headers || "";
          jqXHR.readyState = status > 0 ? 4 : 0;
          isSuccess = status >= 200 && status < 300 || status === 304;
          if (responses) {
            response = ajaxHandleResponses(s, jqXHR, responses);
          }
          if (!isSuccess && jQuery2.inArray("script", s.dataTypes) > -1 && jQuery2.inArray("json", s.dataTypes) < 0) {
            s.converters["text script"] = function() {
            };
          }
          response = ajaxConvert(s, response, jqXHR, isSuccess);
          if (isSuccess) {
            if (s.ifModified) {
              modified = jqXHR.getResponseHeader("Last-Modified");
              if (modified) {
                jQuery2.lastModified[cacheURL] = modified;
              }
              modified = jqXHR.getResponseHeader("etag");
              if (modified) {
                jQuery2.etag[cacheURL] = modified;
              }
            }
            if (status === 204 || s.type === "HEAD") {
              statusText = "nocontent";
            } else if (status === 304) {
              statusText = "notmodified";
            } else {
              statusText = response.state;
              success = response.data;
              error = response.error;
              isSuccess = !error;
            }
          } else {
            error = statusText;
            if (status || !statusText) {
              statusText = "error";
              if (status < 0) {
                status = 0;
              }
            }
          }
          jqXHR.status = status;
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
          } else {
            deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(statusCode);
          statusCode = void 0;
          if (fireGlobals) {
            globalEventContext.trigger(
              isSuccess ? "ajaxSuccess" : "ajaxError",
              [jqXHR, s, isSuccess ? success : error]
            );
          }
          completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
          if (fireGlobals) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
            if (!--jQuery2.active) {
              jQuery2.event.trigger("ajaxStop");
            }
          }
        }
        return jqXHR;
      },
      getJSON: function(url, data, callback) {
        return jQuery2.get(url, data, callback, "json");
      },
      getScript: function(url, callback) {
        return jQuery2.get(url, void 0, callback, "script");
      }
    });
    jQuery2.each(["get", "post"], function(_i, method) {
      jQuery2[method] = function(url, data, callback, type2) {
        if (isFunction(data)) {
          type2 = type2 || callback;
          callback = data;
          data = void 0;
        }
        return jQuery2.ajax(jQuery2.extend({
          url,
          type: method,
          dataType: type2,
          data,
          success: callback
        }, jQuery2.isPlainObject(url) && url));
      };
    });
    jQuery2.ajaxPrefilter(function(s) {
      var i2;
      for (i2 in s.headers) {
        if (i2.toLowerCase() === "content-type") {
          s.contentType = s.headers[i2] || "";
        }
      }
    });
    jQuery2._evalUrl = function(url, options, doc) {
      return jQuery2.ajax({
        url,
        type: "GET",
        dataType: "script",
        cache: true,
        async: false,
        global: false,
        converters: {
          "text script": function() {
          }
        },
        dataFilter: function(response) {
          jQuery2.globalEval(response, options, doc);
        }
      });
    };
    jQuery2.fn.extend({
      wrapAll: function(html) {
        var wrap;
        if (this[0]) {
          if (isFunction(html)) {
            html = html.call(this[0]);
          }
          wrap = jQuery2(html, this[0].ownerDocument).eq(0).clone(true);
          if (this[0].parentNode) {
            wrap.insertBefore(this[0]);
          }
          wrap.map(function() {
            var elem = this;
            while (elem.firstElementChild) {
              elem = elem.firstElementChild;
            }
            return elem;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(html) {
        if (isFunction(html)) {
          return this.each(function(i2) {
            jQuery2(this).wrapInner(html.call(this, i2));
          });
        }
        return this.each(function() {
          var self2 = jQuery2(this), contents = self2.contents();
          if (contents.length) {
            contents.wrapAll(html);
          } else {
            self2.append(html);
          }
        });
      },
      wrap: function(html) {
        var htmlIsFunction = isFunction(html);
        return this.each(function(i2) {
          jQuery2(this).wrapAll(htmlIsFunction ? html.call(this, i2) : html);
        });
      },
      unwrap: function(selector) {
        this.parent(selector).not("body").each(function() {
          jQuery2(this).replaceWith(this.childNodes);
        });
        return this;
      }
    });
    jQuery2.expr.pseudos.hidden = function(elem) {
      return !jQuery2.expr.pseudos.visible(elem);
    };
    jQuery2.expr.pseudos.visible = function(elem) {
      return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    };
    jQuery2.ajaxSettings.xhr = function() {
      try {
        return new window2.XMLHttpRequest();
      } catch (e) {
      }
    };
    var xhrSuccessStatus = {
      0: 200,
      1223: 204
    }, xhrSupported = jQuery2.ajaxSettings.xhr();
    support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
    support.ajax = xhrSupported = !!xhrSupported;
    jQuery2.ajaxTransport(function(options) {
      var callback, errorCallback;
      if (support.cors || xhrSupported && !options.crossDomain) {
        return {
          send: function(headers, complete) {
            var i2, xhr = options.xhr();
            xhr.open(
              options.type,
              options.url,
              options.async,
              options.username,
              options.password
            );
            if (options.xhrFields) {
              for (i2 in options.xhrFields) {
                xhr[i2] = options.xhrFields[i2];
              }
            }
            if (options.mimeType && xhr.overrideMimeType) {
              xhr.overrideMimeType(options.mimeType);
            }
            if (!options.crossDomain && !headers["X-Requested-With"]) {
              headers["X-Requested-With"] = "XMLHttpRequest";
            }
            for (i2 in headers) {
              xhr.setRequestHeader(i2, headers[i2]);
            }
            callback = function(type2) {
              return function() {
                if (callback) {
                  callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                  if (type2 === "abort") {
                    xhr.abort();
                  } else if (type2 === "error") {
                    if (typeof xhr.status !== "number") {
                      complete(0, "error");
                    } else {
                      complete(
                        xhr.status,
                        xhr.statusText
                      );
                    }
                  } else {
                    complete(
                      xhrSuccessStatus[xhr.status] || xhr.status,
                      xhr.statusText,
                      (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                      xhr.getAllResponseHeaders()
                    );
                  }
                }
              };
            };
            xhr.onload = callback();
            errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
            if (xhr.onabort !== void 0) {
              xhr.onabort = errorCallback;
            } else {
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  window2.setTimeout(function() {
                    if (callback) {
                      errorCallback();
                    }
                  });
                }
              };
            }
            callback = callback("abort");
            try {
              xhr.send(options.hasContent && options.data || null);
            } catch (e) {
              if (callback) {
                throw e;
              }
            }
          },
          abort: function() {
            if (callback) {
              callback();
            }
          }
        };
      }
    });
    jQuery2.ajaxPrefilter(function(s) {
      if (s.crossDomain) {
        s.contents.script = false;
      }
    });
    jQuery2.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(text) {
          jQuery2.globalEval(text);
          return text;
        }
      }
    });
    jQuery2.ajaxPrefilter("script", function(s) {
      if (s.cache === void 0) {
        s.cache = false;
      }
      if (s.crossDomain) {
        s.type = "GET";
      }
    });
    jQuery2.ajaxTransport("script", function(s) {
      if (s.crossDomain || s.scriptAttrs) {
        var script, callback;
        return {
          send: function(_, complete) {
            script = jQuery2("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
              script.remove();
              callback = null;
              if (evt) {
                complete(evt.type === "error" ? 404 : 200, evt.type);
              }
            });
            document2.head.appendChild(script[0]);
          },
          abort: function() {
            if (callback) {
              callback();
            }
          }
        };
      }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery2.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var callback = oldCallbacks.pop() || jQuery2.expando + "_" + nonce.guid++;
        this[callback] = true;
        return callback;
      }
    });
    jQuery2.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
      var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
      if (jsonProp || s.dataTypes[0] === "jsonp") {
        callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
        if (jsonProp) {
          s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
        } else if (s.jsonp !== false) {
          s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
        }
        s.converters["script json"] = function() {
          if (!responseContainer) {
            jQuery2.error(callbackName + " was not called");
          }
          return responseContainer[0];
        };
        s.dataTypes[0] = "json";
        overwritten = window2[callbackName];
        window2[callbackName] = function() {
          responseContainer = arguments;
        };
        jqXHR.always(function() {
          if (overwritten === void 0) {
            jQuery2(window2).removeProp(callbackName);
          } else {
            window2[callbackName] = overwritten;
          }
          if (s[callbackName]) {
            s.jsonpCallback = originalSettings.jsonpCallback;
            oldCallbacks.push(callbackName);
          }
          if (responseContainer && isFunction(overwritten)) {
            overwritten(responseContainer[0]);
          }
          responseContainer = overwritten = void 0;
        });
        return "script";
      }
    });
    support.createHTMLDocument = function() {
      var body = document2.implementation.createHTMLDocument("").body;
      body.innerHTML = "<form></form><form></form>";
      return body.childNodes.length === 2;
    }();
    jQuery2.parseHTML = function(data, context, keepScripts) {
      if (typeof data !== "string") {
        return [];
      }
      if (typeof context === "boolean") {
        keepScripts = context;
        context = false;
      }
      var base, parsed, scripts;
      if (!context) {
        if (support.createHTMLDocument) {
          context = document2.implementation.createHTMLDocument("");
          base = context.createElement("base");
          base.href = document2.location.href;
          context.head.appendChild(base);
        } else {
          context = document2;
        }
      }
      parsed = rsingleTag.exec(data);
      scripts = !keepScripts && [];
      if (parsed) {
        return [context.createElement(parsed[1])];
      }
      parsed = buildFragment([data], context, scripts);
      if (scripts && scripts.length) {
        jQuery2(scripts).remove();
      }
      return jQuery2.merge([], parsed.childNodes);
    };
    jQuery2.fn.load = function(url, params, callback) {
      var selector, type2, response, self2 = this, off = url.indexOf(" ");
      if (off > -1) {
        selector = stripAndCollapse(url.slice(off));
        url = url.slice(0, off);
      }
      if (isFunction(params)) {
        callback = params;
        params = void 0;
      } else if (params && typeof params === "object") {
        type2 = "POST";
      }
      if (self2.length > 0) {
        jQuery2.ajax({
          url,
          type: type2 || "GET",
          dataType: "html",
          data: params
        }).done(function(responseText) {
          response = arguments;
          self2.html(selector ? jQuery2("<div>").append(jQuery2.parseHTML(responseText)).find(selector) : responseText);
        }).always(callback && function(jqXHR, status) {
          self2.each(function() {
            callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
          });
        });
      }
      return this;
    };
    jQuery2.expr.pseudos.animated = function(elem) {
      return jQuery2.grep(jQuery2.timers, function(fn2) {
        return elem === fn2.elem;
      }).length;
    };
    jQuery2.offset = {
      setOffset: function(elem, options, i2) {
        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery2.css(elem, "position"), curElem = jQuery2(elem), props = {};
        if (position === "static") {
          elem.style.position = "relative";
        }
        curOffset = curElem.offset();
        curCSSTop = jQuery2.css(elem, "top");
        curCSSLeft = jQuery2.css(elem, "left");
        calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
        if (calculatePosition) {
          curPosition = curElem.position();
          curTop = curPosition.top;
          curLeft = curPosition.left;
        } else {
          curTop = parseFloat(curCSSTop) || 0;
          curLeft = parseFloat(curCSSLeft) || 0;
        }
        if (isFunction(options)) {
          options = options.call(elem, i2, jQuery2.extend({}, curOffset));
        }
        if (options.top != null) {
          props.top = options.top - curOffset.top + curTop;
        }
        if (options.left != null) {
          props.left = options.left - curOffset.left + curLeft;
        }
        if ("using" in options) {
          options.using.call(elem, props);
        } else {
          curElem.css(props);
        }
      }
    };
    jQuery2.fn.extend({
      offset: function(options) {
        if (arguments.length) {
          return options === void 0 ? this : this.each(function(i2) {
            jQuery2.offset.setOffset(this, options, i2);
          });
        }
        var rect2, win, elem = this[0];
        if (!elem) {
          return;
        }
        if (!elem.getClientRects().length) {
          return { top: 0, left: 0 };
        }
        rect2 = elem.getBoundingClientRect();
        win = elem.ownerDocument.defaultView;
        return {
          top: rect2.top + win.pageYOffset,
          left: rect2.left + win.pageXOffset
        };
      },
      position: function() {
        if (!this[0]) {
          return;
        }
        var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
        if (jQuery2.css(elem, "position") === "fixed") {
          offset = elem.getBoundingClientRect();
        } else {
          offset = this.offset();
          doc = elem.ownerDocument;
          offsetParent = elem.offsetParent || doc.documentElement;
          while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery2.css(offsetParent, "position") === "static") {
            offsetParent = offsetParent.parentNode;
          }
          if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = jQuery2(offsetParent).offset();
            parentOffset.top += jQuery2.css(offsetParent, "borderTopWidth", true);
            parentOffset.left += jQuery2.css(offsetParent, "borderLeftWidth", true);
          }
        }
        return {
          top: offset.top - parentOffset.top - jQuery2.css(elem, "marginTop", true),
          left: offset.left - parentOffset.left - jQuery2.css(elem, "marginLeft", true)
        };
      },
      offsetParent: function() {
        return this.map(function() {
          var offsetParent = this.offsetParent;
          while (offsetParent && jQuery2.css(offsetParent, "position") === "static") {
            offsetParent = offsetParent.offsetParent;
          }
          return offsetParent || documentElement;
        });
      }
    });
    jQuery2.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop2) {
      var top2 = "pageYOffset" === prop2;
      jQuery2.fn[method] = function(val) {
        return access(this, function(elem, method2, val2) {
          var win;
          if (isWindow(elem)) {
            win = elem;
          } else if (elem.nodeType === 9) {
            win = elem.defaultView;
          }
          if (val2 === void 0) {
            return win ? win[prop2] : elem[method2];
          }
          if (win) {
            win.scrollTo(
              !top2 ? val2 : win.pageXOffset,
              top2 ? val2 : win.pageYOffset
            );
          } else {
            elem[method2] = val2;
          }
        }, method, val, arguments.length);
      };
    });
    jQuery2.each(["top", "left"], function(_i, prop2) {
      jQuery2.cssHooks[prop2] = addGetHookIf(
        support.pixelPosition,
        function(elem, computed) {
          if (computed) {
            computed = curCSS(elem, prop2);
            return rnumnonpx.test(computed) ? jQuery2(elem).position()[prop2] + "px" : computed;
          }
        }
      );
    });
    jQuery2.each({ Height: "height", Width: "width" }, function(name, type2) {
      jQuery2.each({
        padding: "inner" + name,
        content: type2,
        "": "outer" + name
      }, function(defaultExtra, funcName) {
        jQuery2.fn[funcName] = function(margin, value) {
          var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
          return access(this, function(elem, type3, value2) {
            var doc;
            if (isWindow(elem)) {
              return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
            }
            if (elem.nodeType === 9) {
              doc = elem.documentElement;
              return Math.max(
                elem.body["scroll" + name],
                doc["scroll" + name],
                elem.body["offset" + name],
                doc["offset" + name],
                doc["client" + name]
              );
            }
            return value2 === void 0 ? jQuery2.css(elem, type3, extra) : jQuery2.style(elem, type3, value2, extra);
          }, type2, chainable ? margin : void 0, chainable);
        };
      });
    });
    jQuery2.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(_i, type2) {
      jQuery2.fn[type2] = function(fn2) {
        return this.on(type2, fn2);
      };
    });
    jQuery2.fn.extend({
      bind: function(types, data, fn2) {
        return this.on(types, null, data, fn2);
      },
      unbind: function(types, fn2) {
        return this.off(types, null, fn2);
      },
      delegate: function(selector, types, data, fn2) {
        return this.on(types, selector, data, fn2);
      },
      undelegate: function(selector, types, fn2) {
        return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn2);
      },
      hover: function(fnOver, fnOut) {
        return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
      }
    });
    jQuery2.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
      function(_i, name) {
        jQuery2.fn[name] = function(data, fn2) {
          return arguments.length > 0 ? this.on(name, null, data, fn2) : this.trigger(name);
        };
      }
    );
    var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
    jQuery2.proxy = function(fn2, context) {
      var tmp, args, proxy;
      if (typeof context === "string") {
        tmp = fn2[context];
        context = fn2;
        fn2 = tmp;
      }
      if (!isFunction(fn2)) {
        return void 0;
      }
      args = slice.call(arguments, 2);
      proxy = function() {
        return fn2.apply(context || this, args.concat(slice.call(arguments)));
      };
      proxy.guid = fn2.guid = fn2.guid || jQuery2.guid++;
      return proxy;
    };
    jQuery2.holdReady = function(hold) {
      if (hold) {
        jQuery2.readyWait++;
      } else {
        jQuery2.ready(true);
      }
    };
    jQuery2.isArray = Array.isArray;
    jQuery2.parseJSON = JSON.parse;
    jQuery2.nodeName = nodeName;
    jQuery2.isFunction = isFunction;
    jQuery2.isWindow = isWindow;
    jQuery2.camelCase = camelCase;
    jQuery2.type = toType;
    jQuery2.now = Date.now;
    jQuery2.isNumeric = function(obj) {
      var type2 = jQuery2.type(obj);
      return (type2 === "number" || type2 === "string") && !isNaN(obj - parseFloat(obj));
    };
    jQuery2.trim = function(text) {
      return text == null ? "" : (text + "").replace(rtrim, "$1");
    };
    var _jQuery = window2.jQuery, _$ = window2.$;
    jQuery2.noConflict = function(deep) {
      if (window2.$ === jQuery2) {
        window2.$ = _$;
      }
      if (deep && window2.jQuery === jQuery2) {
        window2.jQuery = _jQuery;
      }
      return jQuery2;
    };
    if (typeof noGlobal === "undefined") {
      window2.jQuery = window2.$ = jQuery2;
    }
    return jQuery2;
  });
})(jquery);
const jQuery = jquery.exports;
const convertHTML = htmlToVdom({
  VNode: vnode,
  VText: vtext
});
jQuery.fn.vhtml = vhtml;
if ($) {
  $.fn.vhtml = vhtml;
}
function vhtml(html) {
  return this.map(function() {
    return _vhtml(this, html);
  });
}
function _vhtml(element2, html) {
  if (element2.innerHTML) {
    html = element2.outerHTML.replace(element2.innerHTML, html);
  } else {
    html = element2.outerHTML.replace("</", `${html}</`);
  }
  const oldTree = convertHTML(element2.outerHTML);
  const newTree = convertHTML(html);
  const patches = virtualDom.diff(oldTree, newTree);
  return virtualDom.patch(element2, patches);
}
export {
  vhtml as default
};
