<template>
	<form @submit="formSubmit" @reset="formReset">
		<view class="uni-form-item uni-column">
			<view class="head">账簿名字</view>
			<input class="uni-input" name="input" placeholder="请输入账簿名字!" />
		</view>
		<view class="uni-form-item uni-column">
			<view class="head">账簿描述</view>
			<input class="uni-input" name="input" placeholder="请输入账簿描述!" />	
		</view>
		<view class="uni-form-item uni-column">
			<view class="head">账簿封面</view>
			<input class="uni-input" name="input" placeholder="请输入账簿封面!" />
		</view>
		<view class="uni-btn-v">
			<button form-type="submit">Submit</button>
			<button type="default" form-type="reset">Reset</button>
		</view>
	</form>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods: {
			formSubmit(){
				
			},
			formReset(){
				
			}
		}
	}
</script>

<style>
	.uni-form-item {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-content: center;
		align-items: center;
		height: 70upx;
		padding: 10upx 0;
		border: #2C405A 1upx solid ;
	}
	.head {
		width: 160upx;
	}
	.head {
		
	}
</style>
