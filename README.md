# eLog library client UI

This is the collection eLog UI component developed atop [Sencha Touch](http://www.sencha.com/products/touch/). eLog libarries were first released in 2010 and have grown up since then. Its API usage and examples are provided with a rich documentation and in-line demos at [eLog documentation](http://www.elifelog.org/lab/elog_doc). Please visit the documentation site and check the detail there. In case of Q&A, please create an issue page here.

## API Documentation
See http://www.elifelog.org/lab/elog_doc

## Demos
### On-line Demo
On-line demo is available at (http://elifelog.org/lab/elog/examples/mediamanager/).

### Video Demos
See our list of video demos 

| Column1        | Column3           | Column3  |
| ------------- |-------------| -----|
|Complex event pattern editor     | Composite Key-value-map viewer | Composite GPS path image view |
| [![Complex event pattern editor](http://img.youtube.com/vi/YcXjfb0WQbg/0.jpg)](https://www.youtube.com/v/YcXjfb0WQbg?version=3&autoplay=1&vq=hd1080)      | [![ Composite Key-value-map viewer](http://img.youtube.com/vi/U036e_ta5b8/0.jpg)](https://www.youtube.com/v/U036e_ta5b8?version=3&autoplay=1&vq=hd1080)      |   [![Composite GPS path image view](http://img.youtube.com/vi/2dYIYQKQ75Y/0.jpg)](https://www.youtube.com/v/2dYIYQKQ75Y?version=3&autoplay=1&vq=hd1080) |
|Composite GPS cluster image view     | Composite thumbnaild and slideshow view | Composite GPS data path viewer |
| [![Composite GPS cluster image view](http://img.youtube.com/vi/tza5lfm1xzI/0.jpg)](https://www.youtube.com/v/tza5lfm1xzI?version=3&autoplay=1&vq=hd1080)      | [![ Composite thumbnaild and slideshow view](http://img.youtube.com/vi/GT-nMxO0V4Q/0.jpg)](https://www.youtube.com/v/GT-nMxO0V4Q?version=3&autoplay=1&vq=hd1080)      |   [![Composite GPS data path viewer](http://img.youtube.com/vi/2dYIYQKQ75Y/0.jpg)](https://www.youtube.com/v/2dYIYQKQ75Y?version=3&autoplay=1&vq=hd1080) |
|Clustered GPS view     | GPS path view | Image thumbnail view |
| [![Clustered GPS view](http://img.youtube.com/vi/tza5lfm1xzI/0.jpg)](https://www.youtube.com/v/tza5lfm1xzI?version=3&autoplay=1&vq=hd1080)      | [![ GPS path view](http://img.youtube.com/vi/J0BR5mMulA8/0.jpg)](https://www.youtube.com/v/J0BR5mMulA8?version=3&autoplay=1&vq=hd1080)      |   [![Image thumbnail view](http://img.youtube.com/vi/nUDY5cZ_BBU/0.jpg)](https://www.youtube.com/v/nUDY5cZ_BBU?version=3&autoplay=1&vq=hd1080) |
|Image slideshow     | Image cover flow view | Data manager |
| [![Clustered GPS view](http://img.youtube.com/vi/12y4f9WY_KM/0.jpg)](https://www.youtube.com/v/12y4f9WY_KM?version=3&autoplay=1&vq=hd1080)      | [![ GPS path view](http://img.youtube.com/vi/Gy0yEJvO0LY/0.jpg)](https://www.youtube.com/v/Gy0yEJvO0LY?version=3&autoplay=1&vq=hd1080)      |   [![Image thumbnail view](http://img.youtube.com/vi/4uR8rw-fKJQ/0.jpg)](https://www.youtube.com/v/4uR8rw-fKJQ?version=3&autoplay=1&vq=hd1080) |

## Getting Started with eLog APIs

The below figure gives an abstract view of eLog service structure. It basically reads external sources and parse for the data analysis and then save the result back to the store to archive user's life logs. External clients connected to the server through HTTP/JSON call can access archived lifelog. Our APIs supports all these process from both server and client sides.

<!--![eLog Service Configuration](./guides/getting_started/images/elifelog_service_structure.jpg)-->

<img src="http://elifelog.org/lab/elog_doc/guides/getting_started/images/elifelog_service_structure.jpg" width="100%">

Let us describe the setup procedure for both cases. This guide will explain the setup procedure for both server and client services. FYI, The communication between the server and GUI is pure HTTP/JSON based REST service. This makes the eLog UI and server componenet are completely independent. If you have existing servers, you may adopt your web service and modify the interface to work with eLog UI. 

## Prepare UI Development Environment
The current UI library is developed on top of [Sencha Touch](http://www.sencha.com/products/touch/). We recommend to use Sencha's developer tool [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/) and follow its instruction to build up an App. For web App developer, belows are prerequesite software for the development. 

1. [Java SE Runtime Environment](http://www.oracle.com/technetwork/java/javase/downloads/jre7-downloads-1880261.html) is required to run Sencha Cmd.
2. [Ruby](https://www.ruby-lang.org/en/downloads/) is needed for Sencha Cmd to create the compiled CSS used by Sencha Touch.
3. Download the latest [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/download) which provides a full set of App management features.
4. If you prefer integrated development environment, you may use [Aptana](http://www.aptana.com). For code assist for Sencha Touch, refer <http://stackoverflow.com/questions/23691570/code-completion-sencha-aptana-studio-3>
5. Download Sencha Touch SDK. Let us assume the installing directory */anydirectory/sdk/*. Then download and unzip [Sencha Touch](http://www.sencha.com/products/touch/download) to */anydirectory/sdk/touch*.

For further installation detail, please also check [Sencha's Installation Instruction](http://docs.sencha.com/touch/2.4/getting_started/getting_started.html)

### Download eLog UI
The GUI part of eLog libraries is available at GitHub. You may visit [elog GitHub](https://github.com/eLifeLogTeam/elog/) to download the zip file or clone it to your server using:
```
git clone https://github.com/eLifeLogTeam/elog/
```
	
### External libraries
eLog UI utilizes external libraries. Download external libraries if needed. First create a sub directory */anydirectory/sdk/library*

* [Ace Javascript Code Editor](https://github.com/ajaxorg/ace-builds/): Clone at (ex. sdk/library/ace_build)
```
git clone https://github.com/ajaxorg/ace-builds.git
```
* [IcoMoon](https://icomoon.io) free icons: Clone at (ex. sdk/library/IcoMoon--limited--master)
```
git clone https://github.com/Keyamoon/IcoMoon-Free.git
```
* [Coverflow extension for Sencha Touch](https://github.com/elmasse/Ext.ux.Cover): Clone at (ex. sdk/library/Ext.ux.Cover)
```
git clone https://github.com/elmasse/Ext.ux.Cover.git
```
* [A Sencha Touch Calendar](https://market.sencha.com/extensions/ext-ux-touchcalendar): Clone at (ex. sdk/library/Ext.ux.TouchCalendar)
```
git clone https://github.com/SwarmOnline/Ext.ux.TouchCalendar.git
```
* [figue](https://code.google.com/p/figue) -- A Collection of Clustering Algorithms Implemented in Javascript (Visit <https://code.google.com/p/figue/>). Download and upzip at figue directory (ex. sdk/library/figue/).
```
svn checkout http://figue.googlecode.com/svn/trunk/ figue-read-only
```
* [jQuery](http://jquery.com): Clone at (ex. sdk/library/jquery-2.1.1)
```
git clone https://github.com/jquery/jquery.git
```
* [jquery-ui](http://jqueryui.com): Extract under jQuery directory (ex. sdk/library/jquery-2.1.1/jquery-ui-1.11.0/):
```
http://jqueryui.com/resources/download/jquery-ui-1.11.2.zip
```
* [jqueryFileTree](https://github.com/daverogers/jQueryFileTree): Extract under jQuery directory (ex. sdk/library/jquery-2.1.1/jquery.fileTree/):
```
git clone https://github.com/daverogers/jQueryFileTree.git
```

Now you are all set to using eLog GUI libraries :)

## eLog APIs Copyrights

First, thanks for using the eLog library. Before claiming any legal statements of our copyrights, let us first explain why we open this library and then proceed to the formal one.

The aim of this research is helping people manage their own lifelogs and precious memories into their own storage. Challenges are that there exists numerous types of lifelogs equal to the number of people out there. What we are trying is to prepare a fundamental tool to help users easily start logging their lifelogs in a systematic way. We also wish a user to have full and sole priviledges on the data access and management.

In this aspect, while all rights of codes published here are reservered to the eLifeLog.org, developers may freely use our codes for personal, educational and research purposes. However we do not allow the commercial use and the use by any company for profit in any steps of your development and products. (Note: One exception is the user interface part which we develop atop Sencha Touch. We decide to follow the original license (GPL V3). eLog UI parts are separately published at GitHub (https://github.com/eLifeLogTeam/elog/))

You can develop and distribute Apps or software programs using our libraries but they should be distributed for free and you should not collect users's lifelog to your server or to any cloud servers in any cases by any means. In other words, your Apps or software should not collect any information (even login IPs) about the user. Your app should work independently (i.e. a strandalone App) without the need for connection or communication with your server. References to our code must be embedded in your codes and appeared in your credits. You may inform us to know either to test or to introduce your work at this web site. 

For formal copyright stuffs, while keeping the above condition mandatory, <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">eLifeLog.org APIs</span> provided by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.elifelog.org" property="cc:attributionName" rel="cc:attributionURL">http://www.elifelog.org</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a> based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="http://www.elifelog.org/lab/elog_doc" rel="dct:source">www.elifelog.org</a>.
 
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a>


More questions?
---------------

Feel free to [post an issue][issues].

[issues]: https://github.com/eLifeLogTeam/elog/issues 
