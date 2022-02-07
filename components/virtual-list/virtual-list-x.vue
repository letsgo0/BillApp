<template>
	<view class="virtual-list">
		<scroll-view class="scr-view" scroll-x="true" :style="{
						 'width': visualWidth + 'px',
						 'position': 'relative',
					 }" @scroll="scrollHandler">
			<view class="scroll-bar" :style="{'width': wholeWidth + 'px'}"></view>
			<!-- <view class="scroll-bar" :style="{'width': wholeWidth + 'px','height': listHeight + 'px'}"></view> -->
			<view class="list" :style="{'transform': `translateX(${offset}px)`}">
				<template class="item-wrap" v-for="(item,index) in visibleData" :key="item.id">
					<slot :item="item" :index="start + index"></slot>
				</template>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'VirtualList',
		props: {
			// 所有的items
			items: {
				type: Array,
				required: true,
			},
			// 可视区域的item数量
			visualCount: Number,
			// item大小
			itemWidth: Number,
			// 顶部预留的item数
			prevCount: {
				type: Number,
				required: true,
			},
			// 底部预留的item数
			nextCount: {
				type: Number,
				required: true,
			},
			position: {
				type: Number,
				required: true,
			}
		},
		data() {
			return {
				// 起始
				start: 0,
				// list 偏移量
				offset: 0,
			}
		},
		computed: {
			end() {
				return Math.min(this.start + this.prevCount + this.visualCount + this.nextCount, this.items.length)
			},
			// 可视区域的item
			visibleData() {
				return this.items.slice(this.start, this.end);
			},
			// 可视列表宽度或高度
			visualWidth() {
				return this.visualCount * this.itemWidth
			},
			// 需要展示的数据的总高度或总宽度
			wholeWidth() {
				return this.items.length * this.itemWidth
			}
		},
		methods: {
			// 该函数在模拟机中的窗口在离开手指后惯性划动时并不会响应
			// 在一台真机上是会响应的，丝滑
			scrollHandler(ev) {
				// console.log(ev.detail);
				const scrollLeft = ev.detail.scrollLeft;
				this.scroll.call(this,scrollLeft);
				this.$emit('update:position', scrollLeft);
			},
			scroll(scrollLeft){
				console.log('scroll: ' + scrollLeft);
				let start = Math.floor(scrollLeft / this.itemWidth); // 此时的start为视图窗口对应的item下标
				const dis = Math.min(start, this.prevCount);
				const offset = scrollLeft - (scrollLeft % this.itemWidth) - dis * this.itemWidth;
				start = Math.max(start - this.prevCount, 0); //此时的start是算上顶部预留的item数后的下标
				this.start = start;
				this.offset = offset;				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.virtual-list {
		height: 100%;

		.scr-view {
			height: 100%;

			.scroll-bar {
				height: 100%;
			}

			.list {
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: flex-start;
				padding-right: 15rpx;
			}
		}
	}
</style>
