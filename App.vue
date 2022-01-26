<script>
	import * as DB from './utils/db/dbApi.js'
	export default {
		onLaunch: function() {
			if (!DB.isOpen()) {
				DB.openSqlite();
			}
			DB.createBillsTable()
				.catch(error => console.log(error));
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			DB: DB
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";
	/*每个页面公共css */
	* {
		box-sizing: border-box;
	}
	.tab-bar {
		position: fixed;
		bottom: 0;
		width: 100vw;
	}

	.w-100vw {
		width: 100vw;
	}
</style>
