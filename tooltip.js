class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._toolTipText;
    this._toolTipIcon;
    this._toolTipVisible = false;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<slot>Some default</slot>
    <span>(?)</span>`;
    this.shadowRoot.innerHTML += `
      <style>
        :host(.important) {
          background-color: var(--color-primary, #ccc);
        }

        :host-context(p) {
          font-weight: bold;
        }

        div {
          font-weight: bold;
          text-transform: uppercase;
        }
      </style>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute('text')) {
      this._toolTipText = this.getAttribute('text');
    } else {
      this._toolTipText = 'default text';
    }
    this._toolTipIcon = this.shadowRoot.querySelector('span');
    this._toolTipIcon.addEventListener(
      'mouseenter',
      this._showTooltip.bind(this)
    );
    this._toolTipIcon.addEventListener(
      'mouseleave',
      this._hideTooltip.bind(this)
    );
    this.style.position = 'relative';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'text') {
      this._toolTipText = newValue;
    }
  }

  disconnectedCallback() {
    console.log('disconnected!');
    this._toolTipIcon.removeEventListener('mouseenter', this._showTooltip);
    this._toolTipIcon.removeEventListener('mouseleave', this._hideTooltip);
  }

  static get observedAttributes() {
    return ['text'];
  }

  _render() {
    let tooltipContainer = this.shadowRoot.querySelector('div');
    if (this._toolTipVisible) {
      tooltipContainer = document.createElement('div');
      tooltipContainer.textContent = this._toolTipText;
      tooltipContainer.style.backgroundColor = 'black';
      tooltipContainer.style.color = 'white';
      tooltipContainer.style.position = 'absolute';
      tooltipContainer.style.zIndex = '9999';

      this.shadowRoot.appendChild(tooltipContainer);
    } else {
      if (tooltipContainer) {
        this.shadowRoot.removeChild(tooltipContainer);
      }
    }
  }

  _showTooltip() {
    this._toolTipVisible = true;
    this._render();
  }

  _hideTooltip() {
    this._toolTipVisible = false;
    this._render();
  }
}

customElements.define('namng-tooltip', Tooltip);
