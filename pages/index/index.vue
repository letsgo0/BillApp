<template>
	<view class="content">
		<input id="bill-search-btn" placeholder="账簿搜索框" type="text" value="" />
		<uni-list class="bill-list">
			<uni-list-item v-for="bill in bills" :key="bill.id" :title="bill.title">
				<view class="bill">
					<image src="../../static/logo.png" mode="aspectFit"></image>
					<view class="bill-info">
						<text>{{bill.title}}</text>
						<text>{{bill.createdTime}}</text>
						<text>{{bill.description}}</text>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<button class="add-new-bill" type="warn">添加新账簿</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				bills: [{
					id: 1,
					title: "二零一五年三月九",
					createdTime: new Date(),
					description: "热热闹闹",
				}, {
					id: 1,
					title: "二零一五年三月九",
					createdTime: new Date(),
					description: "热热闹闹",
				}, {
					id: 1,
					title: "二零一五年三月九",
					createdTime: new Date(),
					description: "热热闹闹",
				}]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.add-new-bill {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	.bill {
		display: flex;
		flex-direction: row;
		padding: 20upx 0;
		height: 200upx;
		justify-content: center;
		align-items: center;
		align-content: center;
	}

	.bill image {
		height: 100%;
	}

	.bill-info {
		display: flex;
		flex-direction: column;
	}

	.bill-list {
		background-color: #4CD964;
		width: 100%;
	}

	#bill-search-btn {
		background-color: #C0C0C0;
		color: #2C405A;
		width: 100%;
		height: 80rpx;
		padding-left: 20upx;
	}
</style>
