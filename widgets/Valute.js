import Widget from './Widget';

class Valute extends Widget {
	UNIC_CLASS = 'widget-valute';
	VALUTES = null;

	static Instance = null;

	constructor(props) {
		if (Valute.Instance) return Valute.Instance;
		super(props);

		Valute.Instance = this;
    return Valute.Instance;
	}

	createWidget() {
		super.createWidget();
		if (!this.VALUTES) this.update();
	}

	update = () => {
		fetch('https://www.cbr-xml-daily.ru/daily_json.js')
			.then((res) => res.json())
			.then((json) => {
				this.VALUTES = json;

				const { usd, diffUsd, eur, diffEur, lastUpdate } = this.getData();

				const widgets = document
					.querySelector(this.CONTAINER)
					.querySelectorAll(`.${this.UNIC_CLASS}`);
          
				[...widgets].forEach((node) => {
					const usdNode = node.querySelector('.USD');
					usdNode.classList.remove('growth', 'fall');
					usdNode.classList.add(diffUsd);
					usdNode.querySelector('span.value').innerText = usd;

					const eurNode = node.querySelector('.EUR');
					eurNode.classList.remove('growth', 'fall');
					eurNode.classList.add(diffEur);
					eurNode.querySelector('span.value').innerText = eur;

					node.querySelector('.last_update').innerText = lastUpdate;
				});
			});
	};

	getData = () => {
		const usd = this.VALUTES?.Valute?.USD?.Value || 0.0;
		const diffUsd =
			usd - (this.VALUTES?.Valute?.USD?.Previous || 0) > 0 ? 'growth' : 'fall';

		const eur = this.VALUTES?.Valute?.EUR?.Value || 0.0;
		const diffEur =
			(eur - this.VALUTES?.Valute?.EUR?.Previous || 0) > 0 ? 'growth' : 'fall';

		const lastUpdate = this.VALUTES?.Timestamp
			? new Date(this.VALUTES.Timestamp).toLocaleDateString()
			: 'Нет данных';

		return {
			usd,
			diffUsd,
			eur,
			diffEur,
			lastUpdate,
		};
	};

	render = () => {
		const { usd, diffUsd, eur, diffEur, lastUpdate } = this.getData();

		return `
    <div>
      <div class="info USD ${diffUsd}">
        <span class="valute">&#36</span>
        <p class="stats">
          <span class="value">
          ${usd}
          </span>
           руб.
        </p>
      </div>

      <div class="info EUR ${diffEur}">
        <span class="valute">&#8364;</span>
        <p class="stats">
          <span class="value">
            ${eur}
          </span>
           руб.
        </p>
      </div>
    </div>

    <p class="last_update">
      ${lastUpdate}
    </p>
  
      `;
	};
}

export default Valute;
