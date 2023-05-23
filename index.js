import { CurrentTime, Image, Valute } from './widgets';
import './index.css';

class CreateWidgets {
	CONTAINER = '';

	MODAL = '#w-modal';
	MODAL_CONTENT = '#w-modal__content';

	ROW = 3;
	COLUMNS = 0;

	WIDGETS = [
		{ widget: 'time', module: CurrentTime, title: 'Добавить виджет времени' },
		{ widget: 'valute', module: Valute, title: 'Добавить виджет валют' },
		{ widget: 'image', module: Image, title: 'Добавить виджет изображения' },
	];

	constructor({ container = '#widgets-wrapper', columns = 3 }) {
		this.CONTAINER = container;
		this.COLUMNS = columns;
		this.renderContainer();
		this.bindEvents();
	}

	renderContainer = () => {
		const container = document.createElement('div');
		container.classList.add('w-container');

		const box = document.createElement('div');
		box.classList.add('w-cell');
		box.setAttribute('dropzone', true);

		for (let i = 0; i < this.ROW * this.COLUMNS; i++) {
			container.append(box.cloneNode());
		}

		const modal = document.createElement('div');
		modal.id = 'w-modal';

		const backdrop = document.createElement('div');
		backdrop.id = 'w-modal__backdrop';

		const modalContent = document.createElement('div');
		modalContent.id = 'w-modal__content';

		modal.append(backdrop);
		modal.append(modalContent);

		const button = document.createElement('button');
		button.setAttribute('id', 'add-widget');
		button.setAttribute('title', 'add widget');
		button.setAttribute('role', 'open-modal-with-widgets');
		button.innerHTML = '&plus;';

		const wrapper = document.querySelector(this.CONTAINER);
		wrapper.append(container);
		wrapper.append(button);
		wrapper.append(modal);
	};

	bindEvents = () => {
		const container = document.querySelector(this.CONTAINER);
		const modal = container.querySelector(this.MODAL);

		modal.addEventListener('show', (e) => (e.target.style.display = 'flex'));
		modal.addEventListener('hide', (e) => {
			const target = e.target;
			target.style.display = '';
			const content = target.querySelector(this.MODAL_CONTENT);
			content.innerHTML = '';
		});

		const backdrop = container.querySelector('#w-modal__backdrop');
		const hideModal = new Event('hide');
		backdrop.addEventListener('click', () => modal.dispatchEvent(hideModal));

		container.addEventListener('click', (e) => {
			const target = e.target.closest('button');
			if (!target) return;
			const role = target.getAttribute('role');

			switch (role) {
				case 'open-modal-with-widgets': {
					this.openModalWithWidgets();
					break;
				}
				case 'add-widget': {
					this.addWidget(target);
					break;
				}
			}
		});
	};

	openModalWithWidgets = () => {
		const container = document.querySelector(this.CONTAINER);
		const modal = container.querySelector(this.MODAL);
		const content = modal.querySelector(this.MODAL_CONTENT);

		this.WIDGETS.map((key) => this.appendButton(key, content));

		modal.dispatchEvent(new Event('show'));
	};

	appendButton = ({ widget, title }, container) => {
		const button = document.createElement('button');
		button.innerText = title;
		button.setAttribute('role', 'add-widget');
		button.dataset.widget = widget;

		container.append(button);
	};

	addWidget = (target) => {
		const widget = target.dataset.widget || '';

		const currentWidget = this.WIDGETS.find((item) => item.widget === widget);
		if (currentWidget) {
			const Module = currentWidget.module;
			new Module({
				container: this.CONTAINER,
				box: '.w-cell',
				modal: this.MODAL,
				modalContent: this.MODAL_CONTENT,
			}).createWidget();
		}

		const container = document.querySelector(this.CONTAINER);
		const modal = container.querySelector(this.MODAL);
		const hideModal = new Event('hide');
		modal.dispatchEvent(hideModal);
	};
}

new CreateWidgets({
	columns: 4,
});
