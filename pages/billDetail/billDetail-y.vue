<template>
	<view class="">
		<input id="bill-record-search" placeholder="输入名字搜索" type="text" value="" />
		<!-- 左右划动 -->
		<view class="bill-record-container">
			<vt-list-y  :items="billRecords" :visualCount="10" :itemHeight="80" :preCount="10" :nextCount="10">
				<template v-slot:default="slotProps">
					<view class="item">
						<text>{{slotProps.item.name  }}</text>
						<text>{{slotProps.item.amount }}</text>
						<text>{{slotProps.item.desc }}</text>
					</view>
				</template>
			</vt-list-y>
		</view>
		<button @click="addNewBillRecord" class="tab-bar" type="warn">新增记录</button>
	</view>
</template>

<script>
	import vtListY from '/components/virtual-list/virtual-list-y.vue'
	export default {
		components: {
			'vt-list-y': vtListY,
		},
		data() {
			return {
				billRecords: []
			}
		},
		onLoad(param) {
			this.generate(10000);
			// console.log(this.billRecords);
			// getApp().globalData.DB.get

		},
		methods: {
			generate(length = 50) {
				for (let i = 0; i < length; i++) {
					this.billRecords[i] = {
						name: '张三',
						amount: i,
						desc: '家住中国'
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	#bill-record-search {
		background-color: #18BC37;
		color: #2C405A;
		width: 100%;
		height: 100rpx;
	}

	.bill-record-container {
		// width: 100%;
		// height: 800px;
		// background-color: #C0C0C0;

		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			height: 100rpx;
			border: 1px solid red;
		}
	}
</style>
