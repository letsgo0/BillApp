<template>
	<view class="virtual-list">
		<scroll-view scroll-y="true" :style="{
						 'height': visualHeight + 'rpx',
						 'position': 'relative'
					 }" @scroll="scrollHandler">
			<view class="scroll-bar" :style="{
					'height': wholeHeight + 'rpx'
				  }"></view>
			<view class="list" :style="{
					  'transform': `translateY(${offset}rpx)`
				  }">
				<view class="item-wrap" v-for="item in visibleData" :key="item.id">
					<slot :item="item"></slot>
				</view>
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
				default: []
			},
			// 可视区域的item数量
			visualCount: Number,
			// item大小
			itemHeight: Number,
			// 顶部预留的item数
			preCount: {
				type: Number,
				required: true,
				default: 10,
			},
			// 底部预留的item数
			nextCount: {
				type: Number,
				required: true,
				default: 10,
			}
		},
		data() {
			return {
				// 起始
				start: 0,
				end: Math.min(0 + this.visualCount + this.nextCount, this.items.length),
				// list 偏移量
				offset: 0,
			}
		},
		computed: {
			// 可视区域的item
			visibleData() {
				return this.items.slice(this.start, this.end);
			},
			// 可视列表宽度或高度
			visualHeight() {
				return this.visualCount * this.itemHeight
			},
			// 需要展示的数据的总高度或总宽度
			wholeHeight() {
				return this.items.length * this.itemHeight
			}
		},
		methods: {
			// 该函数在模拟机中的窗口在离开手指后惯性划动时并不会响应
			// 在一台真机上是会响应的，丝滑
			scrollHandler(ev) {
				console.log(ev);
				const scrollTop = ev.detail.scrollTop;
				let start = Math.floor(scrollTop / this.itemHeight);// 此时的start为视图窗口对应的item下标
				let end = start + this.visualCount + this.nextCount;
				end = Math.min(end, this.items.length);
				const dis = Math.min(start, this.prevCount)
				const offset = scrollTop - (scrollTop % this.itemHeight) - dis * this.itemHeight;
				start = Math.max(start - this.prevCount, 0);//此时的start是算上顶部预留的item数后的下标
				this.start = start;
				this.end = end;
				this.offset = offset;
			}
		}
	}
</script>

<style scoped>
	.list {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>
