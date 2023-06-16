/**
 * Build styles
 */
import './index.scss';

import { IconListBulleted} from '@codexteam/icons'

/**
 * @typedef {object} ListData
 * @property {string} style - can be ordered or unordered
 * @property {Array} items - li elements
 */

/**
 * @typedef {object} ListConfig
 * @description Tool's config from Editor
 * @property {string} defaultStyle — ordered or unordered
 */

/**
 * List Tool for the Editor.js 2.0
 */
export default class List {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: IconListBulleted,
      title: 'Bullet',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    /**
     * HTML nodes
     *
     * @private
     */
    this._elements = {
      frame: null,
      wrapper: null,
      titleInput: null
    };

    this.api = api;
    this.readOnly = readOnly;

    this.settings = [
      {
        name: 'merit',
        label: this.api.i18n.t('Merit'),
        icon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="3.90183" height="11.7055" rx="1.95091" transform="matrix(0.707115 -0.707099 0.707115 0.707099 0 5.17383)" fill="#32BE46"/><rect width="15.8018" height="3.90183" rx="1.95091" transform="matrix(0.707115 -0.707099 0.707115 0.707099 6.06738 11.2422)" fill="#32BE46"/></svg>',
        default: config.defaultStyle === 'merit' || false,
      },
      {
        name: 'demerit',
        label: this.api.i18n.t('Demerit'),
        icon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="5.17188" width="3.90187" height="11.7056" rx="1.95094" transform="rotate(-45 0 5.17188)" fill="#F05537"/><rect x="6.06738" y="11.2402" width="15.802" height="3.90187" rx="1.95094" transform="rotate(-45 6.06738 11.2402)" fill="#F05537"/></svg>',
        default: config.defaultStyle === 'demerit' || false,
      },
      {
        name: 'neutral',
        label: this.api.i18n.t('Neutral'),
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10Z" fill="#202020"/></svg>',
        default: config.defaultStyle === 'neutral' || true,
      },
    ];

    /**
     * Tool's data
     *
     * @type {ListData}
     */
    this._data = {
      style: this.settings.find((tune) => tune.default === true).name,
      titleName: "",
      items: [],
    };

    this.data = data;
  }

  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    this._elements.frame = this._make('div', this.CSS.frame);
    this._elements.wrapper = this.makeMainTag(this._data.style);
    this._elements.titleInput = document.createElement('input')
    this._elements.titleInput.placeholder = "タイトルを入力 (任意)"
    this._elements.frame.appendChild(this._elements.titleInput);
    this._elements.frame.appendChild(this._elements.wrapper);
    // fill with data
    if (this._data.items.length) {
      this._data.items.forEach((item) => {
        this._elements.wrapper.appendChild(this._make('li', this.CSS.item, {
          innerHTML: item,
        }));
      });
    } else {
      this._elements.wrapper.appendChild(this._make('li', this.CSS.item));
    }
    this.listnerRegister()

    return this._elements.frame;
  }



  /**
   * @returns {ListData}
   * @public
   */
  save() {
    
    return this.data;
  }

  /**
   * Allow List Tool to be converted to/from other block
   *
   * @returns {{export: Function, import: Function}}
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol.
       *
       * @param {ListData} data - list data to create a string from thats
       * @returns {string}
       */
      export: (data) => {
        return data.items.join('. ');
      },
      /**
       * To create a list from other block's string, just put it at the first item
       *
       * @param {string} string - string to create list tool data from that
       * @returns {ListData}
       */
      import: (string) => {
        return {
          items: [ string ],
          style: 'unordered',
        };
      },
    };
  }

  /**
   * Sanitizer rules
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      style: {},
      items: {
        br: true,
      },
    };
  }

  /**
   * Settings
   *
   * @public
   * @returns {Array}
   */
  renderSettings() {
    return this.settings.map(item => ({
      ...item,
      isActive: this._data.style === item.name,
      closeOnActivate: true,
      onActivate: () => this.toggleTune(item.name)
    }))
  }

  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const list = event.detail.data;

    this.data = this.pasteHandler(list);
  }

  /**
   * List Tool on paste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return {
      tags: ['OL', 'UL', 'LI'],
    };
  }

  /**
   *  あるバグの解消のため、renderから独自に切り離した実装。
   *  デフォルトで生成されるリストから別の種類のリストに切り替えた際 (toogleTune()) に、
   *  EnterとBackSpaceに関するイベントリスナーが登録されないため起こるバグであるため、リスナーをここに分離し、
   *  toggleTuneとrenderでどちらも使えるようした。
   */
  listnerRegister(){
    if (!this.readOnly) {
      // detect keydown on the last item to escape List
      this._elements.wrapper.addEventListener('keydown', (event) => {
        const [ENTER, BACKSPACE] = [13, 8]; // key codes
        switch (event.keyCode) {
          case ENTER:
            this.getOutofList(event);
            break;
          case BACKSPACE:
            this.backspace(event);
            break;
        }
      }, false);
    }
  }

  /**
   * Creates or Change type of <ol> depended on style.
   *
   * @param {string} style // merit / demerit / neutral
   * @returns {HTMLOListElement|HTMLUListElement}
   */
  makeMainTag(style) {
    let styleClass = 
        style === 'merit' ? this.CSS.wrapperOlMerit :
        style === 'demerit' ? this.CSS.wrapperOlDemerit : this.CSS.wrapperOlNeutral;
    const tag = 'ol';

    return this._make(tag, [this.CSS.baseBlock, this.CSS.wrapper, styleClass], {
        contentEditable: !this.readOnly,
      });
  }

  /**
   * Toggles List style
   *
   * @param {string} style - 'ordered'|'unordered'
   */
  toggleTune(style) {
    const newTag = this.makeMainTag(style);
    while (this._elements.wrapper.hasChildNodes()) {
      newTag.appendChild(this._elements.wrapper.firstChild);
    }

    this._elements.wrapper.replaceWith(newTag);
    this._elements.wrapper = newTag;
    this._data.style = style;

    let isLenZero = this._elements.titleInput.value.length == 0;
    let nowVal = this._elements.titleInput.value
    switch (style) {
      case 'merit':
        if(isLenZero || nowVal === this.LabelString.demerit)
        this._elements.titleInput.value = this.LabelString.merit
        break;
      case 'demerit':
        if(isLenZero || nowVal === this.LabelString.merit)
        this._elements.titleInput.value = this.LabelString.demerit
        break;
      default:
        break;
    }

    this.listnerRegister()
  }

  /**
   * Styles
   *
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      frame: 'cdx-frame',
      wrapper: 'cdx-list',
      wrapperOlMerit: 'cdx-list--merit',
      wrapperOlDemerit: 'cdx-list--demerit',
      wrapperOlNeutral: 'cdx-list--neutral',
      item: 'cdx-list__item',
    };
  }

  get LabelString(){
    return {
      merit: "メリット",
      demerit: "デメリット"
    }
  }

  /**
   * List data setter
   *
   * @param {ListData} listData
   */
  set data(listData) {
    if (!listData) {
      listData = {};
    }
    this._data.style = listData.style || this.settings.find((tune) => tune.default === true).name;
    this._data.items = listData.items || [];

    const oldView = this._elements.wrapper;

    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  /**
   * Return List data
   *
   * @returns {ListData}
   */
  get data() {
    this._data.items = [];
    const items = this._elements.wrapper.querySelectorAll(`.${this.CSS.item}`);

    for (let i = 0; i < items.length; i++) {
      const value = items[i].innerHTML.replace('<br>', ' ').trim();

      if (value) {
        this._data.items.push(items[i].innerHTML);
      }
    }

    this._data.titleName = this._elements.titleInput.value;

    return this._data;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }

    return currentNode.closest(`.${this.CSS.item}`);
  }

  /**
   * Get out from List Tool
   * by Enter on the empty last item
   *
   * @param {KeyboardEvent} event
   */
  getOutofList(event) {
    const items = this._elements.wrapper.querySelectorAll('.' + this.CSS.item);
    /**
     * Save the last one.
     */
    if (items.length < 2) {
      return;
    }

    const lastItem = items[items.length - 1];
    const currentItem = this.currentItem;
    /** Prevent Default li generation if item is empty */
    if (currentItem === lastItem && !lastItem.textContent.trim().length) {
      /** Insert New Block and set caret */
      currentItem.parentElement.removeChild(currentItem);
      this.api.blocks.insert();
      this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event
   */
  backspace(event) {
    const items = this._elements.wrapper.querySelectorAll('.' + this.CSS.item),
        firstItem = items[0];

    if (!firstItem) {
      return;
    }

    /**
     * Save the last one.
     */
    if (items.length < 2 && !firstItem.innerHTML.replace('<br>', ' ').trim()) {
      event.preventDefault();
    }
  }

  /**
   * Select LI content by CMD+A
   *
   * @param {KeyboardEvent} event
   */
  selectItem(event) {
    event.preventDefault();

    const selection = window.getSelection(),
        currentNode = selection.anchorNode.parentNode,
        currentItem = currentNode.closest('.' + this.CSS.item),
        range = new Range();

    range.selectNodeContents(currentItem);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns {ListData}
   */
  pasteHandler(element) {
    const { tagName: tag } = element;
    let style;
    console.log(tag);
    switch (tag) {
      case 'OL':
        style = 'merit';
        break;
      case 'UL':
      case 'LI':
        style = 'unordered';
    }

    const data = {
      style,
      items: [],
    };

    if (tag === 'LI') {
      data.items = [ element.innerHTML ];
    } else {
      const items = Array.from(element.querySelectorAll('LI'));

      data.items = items
        .map((li) => li.innerHTML)
        .filter((item) => !!item.trim());
    }

    return data;
  }
}