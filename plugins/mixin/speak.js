import * as AZH from '/utils/amoutZH/amoutZH.js'
const speak = {
	data() {
		const enumPlayStatus = {
			'PLAY': 0,
			'PAUSE': 1,
			'STOP': 2,
		};
		return {
			input: '',
			enumPlayStatus,
			playStatus: enumPlayStatus['STOP'],
			amountZH: '',
			innerAudioContext: null,
			order: [],
			isSpeakChanged: true,
			vois: ['error', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'yuan', 'shi', 'bai', 'qian', 'wan'],
			mediaIndex: 0,
		};
	},
	watch: {
		input: {
			handler(val, oldVal) {
				this.stop();
				this.isSpeakChanged = true;
				const res = AZH.num2ZH(val);
				console.log(res);
				this.amountZH = res.value;
				this.order = res.order;
			},
			immediate: true
		},
	},
	onLoad() {
		this.innerAudioContext = uni.createInnerAudioContext();
		this.innerAudioContext.onEnded(this.seamlessPlay.bind(this));
		this.innerAudioContext.onError((res) => {
			console.log(res.errMsg);
			console.log(res.errCode);
		});
		this.innerAudioContext.autoplay = false;
		this.innerAudioContext.loop = false;
	},
	onHide() {
		console.log('hide');
		this.stop();
	},
	methods: {
		speakHandler() {
			console.log('play btn clicked');
			if (this.isSpeakChanged) {
				this.isSpeakChanged = false;
				this.play();
			} else {
				if (this.playStatus === this.enumPlayStatus['PLAY']) {
					this.pause();
				} else {
					this.play();
				}
			}
		},
		//  连续播放
		seamlessPlay() {
			console.log('onend');
			this.mediaIndex++;
			if (this.mediaIndex < this.order.length) {
				this.innerAudioContext.src = `/static/vois/v_${this.vois[this.order[this.mediaIndex]]}.mp3`;
				console.log(this.innerAudioContext.src);
				if (this.playStatus === this.enumPlayStatus['PLAY']) {
					this.innerAudioContext.play();
				}
			} else {
				this.stop();
			}
		},
		play() {
			if (this.playStatus === this.enumPlayStatus['STOP']) {
				// play from the beginning
				console.log('play from zero');
				if (0 == this.order.length) return;
				this.mediaIndex = 0;
				this.innerAudioContext.src = `/static/vois/v_${this.vois[this.order[this.mediaIndex]]}.mp3`;
				console.log(this.innerAudioContext.src);
				this.innerAudioContext.play();
			} else {
				// when pause
				console.log('play after pause');
				this.innerAudioContext.play();
			}
			this.playStatus = this.enumPlayStatus['PLAY'];
		},
		pause() {
			console.log('pasue');
			this.innerAudioContext.pause();
			this.playStatus = this.enumPlayStatus['PAUSE'];
		},
		stop() {
			console.log('stop');
			this.innerAudioContext?.stop();
			this.playStatus = this.enumPlayStatus['STOP'];
		}
	}
}
export {
	speak,
};
