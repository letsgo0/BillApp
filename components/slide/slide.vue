<template>
	<view class="content">
		<view class="slide" @touchstart.capture="touchstart" @touchend.capture="touchend"
			@touchmove.capture="touchmove" :style="{marginLeft:left + 'px'}">
			<view class="slide-index" @click="detailsClick(params)">{{text}}</view>
			<view class="slide-operation">
				<view class="btn-1" @click="edit(params)">修改</view>
				<view class="btn-2" @click="remove(params)">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'slide',
		data() {
			return {
				left: 0,
				isdrag: false,
				NowLeft: 0,
				disX: 0
			};
		},
		props:['params','text'],
		emits: ['edit', 'remove'],
		methods: {
			detailsClick(e){
				this.$emit('detailClick',e)
			},
			edit(e){
				this.$emit('edit',e)
			},
			remove(e){
				this.$emit('remove',e)
			},
			touchend(e) {
				if (this.left > -75) {
					this.left = 0
				} else {
					this.left = -150
				}
				if (this.left < -150) {
					this.left = -150
				}
				this.isdrag = false;
			},
			touchmove(e) {
				if (this.isdrag) {
					this.left = this.NowLeft + e.touches[0].pageX - this.disX;
					if (this.left > 0) {
						this.left = 0
					}
					return false;
				}
			},
			touchstart(e) {
				this.isdrag = true;
				this.NowLeft = parseInt(this.left);
				this.disX = e.touches[0].pageX;
				return false;
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 100%;
		height: 120rpx;
		border-bottom: 1rpx solid #ededed;
		overflow: hidden;
	}

	.slide {
		display: flex;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		
	}

	.slide-index {
		width: 100%;
		flex-shrink: 0;
		text-indent: 1rem;
		line-height: 120rpx;
		font-size: 32rpx;
		color: #333;
	}

	.slide-operation {
		width: 314rpx;
		height: 100%;
		flex-shrink: 0;
		display: flex;
	}
	.slide-operation view{
		flex: 1;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
		font-size: 30rpx;
	}
	.btn-1{
		background-color: #c5c5c5;
	}
	.btn-2{
		background-color: red;
	}
</style>
