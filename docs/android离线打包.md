打包过程
========

 

官网提供了离线打包需要的SDK等[打包资源](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/android)，SDK资源目录下提供了两个示例。

 

准备工程有两个方式，一种是新建工程，一种是借用两个示例中的任意一个为壳。

 

本次以示例为壳，涉及到的有

1. 根据密钥生成的app_key，app_id

2. androidManifest.xml中的user-permission

3. dcloud_properties.xml中的sqlite feature添加(app中用到了sqlite数据库)

4. 签名证书配置

...

 

其他的回过头来再看官网的打包说明，发现已经介绍的很具体了。

 

疑问：

与云打包生成的apk包体积10M来说，离线打包生成的包体积约为30M，变大了。可能包含了多余的模块，也可能与sdk的版本有关系。
