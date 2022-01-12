<template>
	<view class="virtual-list" >
						 <!-- 'height': listHeight + 'px', -->
		<scroll-view scroll-x="true" :style="{
						 'width': visualWidth + 'px',
						 'position': 'relative'
					 }" @scroll="scrollHandler">
			<view class="scroll-bar" :style="{
					'width': wholeWidth + 'px',
					'height': listHeight + 'px'
				  }"></view>
			<view class="list" :style="{
					  'transform': `translateX(${offset}px)`
				  }">
				<view class="item-wrap" :style="{
					'width': itemWidth + 'px'
				}" v-for="item in visibleData" :key="item.id">
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
			// 列表高度
			listHeight: Number,
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
				console.log(ev.detail);
				const scrollLeft = ev.detail.scrollLeft;
				let start = Math.floor(scrollLeft / this.itemWidth); // 此时的start为视图窗口对应的item下标
				// console.log(start);
				let end = start + this.visualCount + this.nextCount;
				end = Math.min(end, this.items.length);
				const dis = Math.min(start, this.prevCount);
				// console.log(dis);
				const offset = scrollLeft - (scrollLeft % this.itemWidth) - dis * this.itemWidth;
				start = Math.max(start - this.prevCount, 0); //此时的start是算上顶部预留的item数后的下标
				this.start = start;
				this.end = end;
				this.offset = offset;
				// console.log('scrollLeft: ' + scrollLeft);
				// console.log(`scrollLeft % this.itemWidth = ${scrollLeft} % ${this.itemWidth} = ${scrollLeft % this.itemWidth}`);
				// console.log(`dis * this.itemWidth = ${dis} * ${this.itemWidth} = ${dis * this.itemWidth}`);
				// console.log(start);
				// console.log(`offset = ${offset}`);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		// overflow-x: ;
		// scroll-behavior: unset;
	}
</style>
