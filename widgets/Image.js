import Widget from './Widget';

class Image extends Widget {
	UNIC_CLASS = 'widget-image';
	API = 'xWrdYakL5fidHlmgDdoilw==m4GHFehrDiaJz3k5';
	CATEGORY = `nature`;
	WIDGET;

	addListenerOnDinamicElement() {
		this.WIDGET.addEventListener('click', (e) => {
			const target = e.target.closest('button');
			if (!target) return;

			const role = target.getAttribute('role');
			switch (role) {
				case 'update': {
					this.getData();
					break;
				}

				case 'config': {
					this.openFormChabgeCategory();
					break;
				}
			}
		});
	}

	createWidget() {
		super.createWidget();
		this.getData();

		this.addListenerOnDinamicElement();
	}

	getData = () => {
		const img = this.WIDGET.querySelector('img');
		this.changeDisabledButton(true);
		img.style.display = 'none';

		fetch(
			`https://api.api-ninjas.com/v1/randomimage?category=${this.CATEGORY}`,
			{
				headers: {
					'X-Api-Key': this.API,
					Accept: 'image/jpg',
				},
			}
		)
			.then((res) => res.blob())
			.then((myBlob) => {
				const url = URL.createObjectURL(myBlob);
				img.src = url;
				img.style.display = 'block';
				this.changeDisabledButton(false);
			})
			.catch((err) => {
				this.changeDisabledButton(false);
			});
	};

	openFormChabgeCategory = () => {
		const modal = document.querySelector(this.MODAL);
		const showModal = new Event('show');
		modal.dispatchEvent(showModal);

		const categories = [
			'nature',
			'city',
			'technology',
			'food',
			'still_life',
			'abstract',
			'wildlife',
		];

		const form = document.createElement('form');
		form.addEventListener('submit', this.changeCategory);

		const contentForm = `
				<select name="category">
					${categories.map(
						(category) => `
					<option ${category === this.CATEGORY}>
						${category}
					</option />`
					)}
				</select>
				<button>Сохранить</button>
		`;

		form.innerHTML = contentForm;
		modal.querySelector(this.MODAL_CONTENT).append(form);
	};

	changeDisabledButton = (value) => {
		[...this.WIDGET.querySelectorAll('button')].forEach(
			(button) => (button.disabled = value)
		);
	};

	changeCategory = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		this.CATEGORY = formData.get('category') || this.CATEGORY;
		const modal = document.querySelector(this.MODAL);
		modal.dispatchEvent(new Event('hide'));
		this.getData();
	};

	render = () => `
		<button class="w-control widget__update-button" role="update">
			&#10227;
		</button>

		<button class="w-control widget__config-button" role="config">
			&#9881;
		</button>

    <div class="widget-image__container">
			<div class="widget-image__preloader"></div>
      <img class="widget-image__img" alt=${this.CATEGORY}>
    </div>
  `;
}

export default Image;
