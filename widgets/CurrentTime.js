import Widget from './Widget';

class CurrentTime extends Widget {
	static Instance = null;

	UNIC_CLASS = 'widget-time';

	HOUR = '00';
	MINUTE = '00';
	SECONDS = '00';

	constructor(props) {
		if (CurrentTime.Instance) return CurrentTime.Instance;
		super(props);

		this.updateTime();

		CurrentTime.Instance = this;
		return CurrentTime.Instance;
	}

	updateTime() {
		const date = new Date();
		const [hour, minute, second] = date.toLocaleTimeString().split(':');
		const ms = date.getMilliseconds();

		this.HOUR = hour;
		this.MINUTE = minute;
		this.SECONDS = second;

		const widgets = document
			.querySelector(this.CONTAINER)
			.querySelectorAll(`.${this.UNIC_CLASS}`);
			
		[...widgets].forEach((node) => {
			node.querySelector('.hour').innerText = this.HOUR;
			node.querySelector('.minute').innerText = this.MINUTE;
			node.querySelector('.seconds').innerText = this.SECONDS;
		});

		setTimeout(() => requestAnimationFrame(() => this.updateTime()), 1000 - ms);
	}

	createWidget() {
		super.createWidget();
	}

	render = () => `
		<p>
			<span class="hour">${this.HOUR}</span>
			:
			<span class="minute">${this.MINUTE}</span>
			:
			<span class="seconds">${this.SECONDS}</span>
		</p>
	`;
}

export default CurrentTime;
