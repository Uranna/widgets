class Widget {

	UNIC_CLASS = '';

	CONTAINER = '';
	BOX = '';
	MODAL = '';
	MODAL_CONTENT = '';

	WIDGET = null;

	static Instance = null

	constructor({ container, box, modal, modalContent }) {
		this.CONTAINER = container;
		this.BOX = box;
		this.MODAL = modal;
		this.MODAL_CONTENT = modalContent;

		this.bindEvent();
	}

	bindEvent() {
		// Удаление
		document.addEventListener('click', (e) => {
			const button = e.target.closest('.widget__remove-button');
			if (button) {
				const widget = button.closest('.widget')
				this.close(widget);
			}
		});

		// Перемещение
		document.addEventListener('dragstart', (e) => {
			const target = e.target.closest('.widget');
			if (target) {
				target.closest(this.BOX).classList.add('original-box');
				target.classList.add('draggable');
			}
		});

		document.addEventListener('dragend', (e) => {
			const target = e.target.closest('.widget');
			if (target) {
				target.classList.remove('draggable');
			}
		});

		document.addEventListener('dragover', (e) => {
			e.preventDefault();
			const target = e.target.closest(this.BOX);
			if (!target) {
				const dragover = document
					.querySelector(this.CONTAINER)
					.querySelector('.dragover');

				if (dragover) dragover.classList.remove('dragover');
				return;
			}

			const oldDragover = document.querySelector('.dragover');
			if (oldDragover && oldDragover !== target) {
				oldDragover.classList.remove('dragover');
			}

			target.classList.add('dragover');
		});

		document.addEventListener('drop', (e) => {
			e.preventDefault();
			const target = e.target.closest(this.BOX);
			if (!target) return;

			const originalWidget = document.querySelector('.draggable');
			const currentWidget = target.querySelector('.widget');
			const originalBox = document
				.querySelector(this.CONTAINER)
				.querySelector('.original-box');

			if (currentWidget) {
				originalBox.append(currentWidget);
			}

			originalBox.classList.remove('original-box');

			const oldDragover = document.querySelector('.dragover');
			if (oldDragover) {
				oldDragover.classList.remove('dragover');
			}

			target.append(originalWidget);
		});
	};

	createWidget () {
		const widget = document.createElement('div');
		widget.classList.add('widget', this.UNIC_CLASS);
		widget.setAttribute('draggable', true);

		const html = this.render();
		if (html && this.CONTAINER) {
			widget.insertAdjacentHTML('beforeend', html);
			widget.insertAdjacentHTML('afterbegin', this.renderButton());

			this.WIDGET = widget

			let currentBox;
			const boxs = document
				.querySelector(this.CONTAINER)
				.querySelectorAll(this.BOX);

			for (let i = 0; i < boxs.length; i++) {
				const box = boxs[i];
				if (box.querySelector('.widget')) continue;
				currentBox = box;
				break;
			}
			currentBox.append(widget);
		}
	};

	close = (target) => {
		target.remove();
	};

	render = () => false;

	renderButton = () => `
		<button class="w-control widget__remove-button">
			&times;
		</button>
	`;
}

export default Widget;
