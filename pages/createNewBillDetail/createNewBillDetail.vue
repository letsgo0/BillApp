<template>
	<form @submit="formSubmit" @reset="formReset">
		<view class="uni-form-item uni-column">
			<view class="head">名字</view>
			<input class="uni-input" name="input" placeholder="请输入名字!" />
		</view>
		<view class="uni-form-item uni-column">
			<view class="head">金额</view>
			<input class="uni-input" name="input" placeholder="请输入金额!" />	
		</view>
		<view class="uni-form-item uni-column">
			<view class="head">备注</view>
			<input class="uni-input" name="input" placeholder="请输入备注[选填]" />
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

<style  scoped>
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
