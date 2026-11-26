const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/__vite-browser-external-D5uN_t1O.js","assets/__vite-browser-external-CotOjYrr.js","assets/php_7_4-DQhoJhDq.js","assets/php_7_4-59u1H5Gs.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-P2Xu9kJm.js";import{n as __commonJSMin,r as __toESM,t as require___vite_browser_external}from"./__vite-browser-external-CotOjYrr.js";var body_default$1=`<?php
$menu_left = '<a href="index.php?redirect">Admin</a>';
$menu_right = '';

if ($user!='guest') {
	$menu_right = $menu_right.'<a href="../post.php">Post</a> ~ <a href="user.php?user='.$user_id.'">'.$user.'</a> ~ <a href="../index.php?action=logout">Logout</a>';
	if ($rank<=0) {
		$menu_right = '<a href="../index.php">Poster</a> ~ '.$menu_right;
	}
}

$body_start = '<div class="menu"><div class="left">'.$menu_left.'</div><div class="right">'.$menu_right.'</div></div><div class="container">';

$body_end = '</div>';
?>`,global_default$1=`<?php
$req_rank = '0';

mysql_connect("127.0.0.1", "root", "password");
mysql_select_db("7");

if (isset($_COOKIE['user'])&&isset($_COOKIE['vericode'])) {
	$user = htmlspecialchars($_COOKIE['user'], ENT_QUOTES);
	$vericode = htmlspecialchars($_COOKIE['vericode'], ENT_QUOTES);
	$query = mysql_query("SELECT * FROM users WHERE user='$user' AND vericode='$vericode'");
	if ($query!=FALSE||mysql_num_rows($query)==1) {
		while ($row=mysql_fetch_array($query)) {
			$user_id = $row['id'];
			$rank = $row['rank'];
		}
	} else {
		echo '<meta http-equiv="refresh" content="0;../index.php?action=logout" />';
	}
} else {
	echo '<meta http-equiv="refresh" content="0;../index.php?action=logout" />';
}

if (isset($rank)) {
	if ($req_rank>$rank) {
		echo '<meta http-equiv="refresh" content="0;../index.php" />';
	}
}

if (isset($_GET['delete'])) {
	$id = $_GET['delete'];
	$query = mysql_query("SELECT * FROM posts WHERE id='$id'");
	if ($query!=FALSE) {
		mysql_query("UPDATE posts SET deleted='true' WHERE id='$id'");
		if (isset($_GET['redirect'])) {
			$poster = $_GET['redirect'];
			echo '<meta http-equiv="refresh" content="0;user.php?user='.$poster.'" />';
		} else {
			echo '<meta http-equiv="refresh" content="0;index.php" />';
		}
	}
}

if (isset($_GET['restore'])) {
	$id = $_GET['restore'];
	$query = mysql_query("SELECT * FROM posts WHERE id='$id'");
	if ($query!=FALSE) {
		mysql_query("UPDATE posts SET deleted='false' WHERE id='$id'");
		if (isset($_GET['redirect'])) {
			$poster = $_GET['redirect'];
			echo '<meta http-equiv="refresh" content="0;user.php?user='.$poster.'" />';
		} else {
			echo '<meta http-equiv="refresh" content="0;index.php" />';
		}
	}
}

if (isset($_POST['form'])) {
	$form = $_POST['form'];
	if ($form='user_edit'&&isset($_POST['poster'])) {
		$poster = $_POST['poster'];
		
		if (isset($_POST['pass'])&&$_POST['pass']!='') {
			$pass = $_POST['pass'];
			mysql_query("UPDATE users SET password='$pass' WHERE id='$poster'") or die(mysql_error());
		}
		if (isset($_POST['rank'])&&$_POST['rank']!='') {
			$rank = $_POST['rank'];
			mysql_query("UPDATE users SET rank='$rank' WHERE id='$poster'");
		}
		if (isset($_POST['user'])&&$_POST['user']!='') {
			$new_user = $_POST['user'];
			$query = mysql_query("SELECT * FROM users WHERE user='$new_user'") or die(mysql_error());
			if ($query!=FALSE&&mysql_num_rows($query)==0) {
				mysql_query("UPDATE users SET user='$new_user' WHERE id='$poster'") or die(mysql_error());
				//echo '<meta http-equiv="refresh" content="0;user.php?user='.$user.'" />';
			}
		} else {
		//echo '<meta http-equiv="refresh" content="0;user.php?user='.$poster.'" />';
		}
	}
}

include 'head.php';
include 'body.php';
?>`,head_default$1=`<?php
$head = '<link rel="stylesheet" href="../style.css" />
<title>Poster</title>';
?>`,admin_default=`<?php
$req_rank = '0';
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<?php
		$query = mysql_query("SELECT * FROM posts ORDER BY id DESC");
		if ($query!=FALSE) {
			while ($row=mysql_fetch_array($query)) {
				if ($row['deleted']=='false') {
					$options = '<a href="index.php?delete='.$row['id'].'">Delete</a> ~ ';
				} else {
					$options = '<a href="index.php?restore='.$row['id'].'">Restore</a> ~ ';
				}
				
				$options = $options.date('jS \\o\\f F, Y \\a\\t g:ia', $row['timestamp']+10*3600);
				
				$poster_id = $row['user_id'];
				$info_query = mysql_query("SELECT * FROM users WHERE id='$poster_id'");
				while($info=mysql_fetch_array($info_query)) {
					$poster = $info['user'];
				}
				
				echo '<div class="post"><div class="left"><a href="user.php?user='.$row['user_id'].'">'.$poster.'</div><div class="right">'.$options.'</div><div class="content">'.$row['content'].'</div></div><br />';
			}
		}
		?>
		<?php echo $body_end; ?>
	</body>
</html>`,update_default=`<?php
mysql_connect("127.0.0.1", "root", "password");
mysql_select_db("7");
?>`,user_default$1=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<?php
		if (isset($_GET['user'])) {
			$poster_id = $_GET['user'];;
			$query = mysql_query("SELECT * FROM users WHERE id='$poster_id'");
			if ($query!=FALSE) {
				while($row=mysql_fetch_array($query)) {
					$poster = $row['user'];
					$poster_pass = $row['password'];
					$poster_rank = $row['rank'];
				}
			}
			
			echo '<div class="title">'.$poster.'</div>';
			
			$query = mysql_query("SELECT * FROM posts WHERE user_id='$poster_id'");
			if ($query!=FALSE) {
				$n = 0;
				$pass_placeholder = '';
				while($n<strlen($poster_pass)) {
					$pass_placeholder = $pass_placeholder.'•';
					$n++;
				}
				$poster_pass = $pass_placeholder;
				echo '<div class="post"><div class="left"></div><div class="right"></div><div class="content"><table><tr><td>Username</td><td>Password</td><td>Rank</td><td></td></tr><tr><td><form action="user.php?user='.$poster_id.'" method="POST" autocomplete="false"><input type="hidden" name="form" value="user_edit" /><input type="hidden" name="poster" value="'.$poster_id.'" /><input type="text" class="input" name="user" placeholder="'.$poster.'" /></td><td><input type="password" class="input" name="pass" placeholder="'.$poster_pass.'" /></td><td><input type="text" class="input" name="rank" placeholder="'.$poster_rank.'" /></td><td><input type="submit" style="display:none" /></form></td></table></div></div>';
				while ($row=mysql_fetch_array($query)) {
					if ($row['deleted']=='false') {
						$options = '<a href="index.php?delete='.$row['id'].'&redirect='.$poster_id.'">Delete</a> ~ ';
					} else {
						$options = '<a href="index.php?restore='.$row['id'].'&redirect='.$poster_id.'">Restore</a> ~ ';
					}
					
					$options = $options.date('jS \\o\\f F, Y \\a\\t g:ia', $row['timestamp']+10*3600);
					
					echo '<div class="post"><div class="left">'.$poster.'</div><div class="right">'.$options.'</div><div class="content">'.$row['content'].'</div></div><br />';
				}
			}
		}
		?>
		<?php echo $body_end; ?>
	</body>
</html> `,body_default=`<?php
$menu_left = '<a href="index.php?redirect">Poster</a>';
$menu_right = '';

if ($user!='guest') {
	$menu_right = $menu_right.'<a href="post.php">Post</a> ~ <a href="user.php?user='.$user_id.'">'.$user.'</a> ~ <a href="index.php?action=logout">Logout</a>';
	if ($rank<=0) {
		$menu_right = '<a href="admin/index.php">Admin</a> ~ '.$menu_right;
	}
}

$body_start = '<div class="menu"><div class="left">'.$menu_left.'</div><div class="right">'.$menu_right.'</div></div><div class="container">';

$body_end = '</div>';
?>`,global_default=`<?php
mysql_connect ("127.0.0.1", "root", "password");
mysql_select_db ("7");

date_default_timezone_set('UTC');

include 'variables.php';

if (isset($_COOKIE['user'])&&isset($_COOKIE['vericode'])) {
	$user = htmlspecialchars($_COOKIE['user'], ENT_QUOTES);
	$vericode = htmlspecialchars($_COOKIE['vericode'], ENT_QUOTES);
	$query = mysql_query ("SELECT * FROM users WHERE user='$user' AND vericode='$vericode'");
	if ($query!=FALSE&&mysql_num_rows($query)==1) {
		while ($row=mysql_fetch_array($query)) {
			$user_id = $row['id'];
			$rank = $row['rank'];
		}
	} else {
		echo '<meta http-equiv="refresh" content="0;login.php?action=logout" />';
	}
} elseif (isset($_POST['form'])&&isset($_POST['user'])&&isset($_POST['pass'])) {
	$user = htmlspecialchars($_POST['user'], ENT_QUOTES);
	$pass = htmlspecialchars($_POST['pass'], ENT_QUOTES);
	$query = mysql_query ("SELECT * FROM users WHERE user='$user' AND password='$pass'");
	if ($query!=FALSE&&mysql_num_rows($query)==1) {
		#Login Success
		while ($row=mysql_fetch_array($query)) {
			$vericode = $row['vericode'];
			setcookie("user", $_POST['user'], time()+31556926);
			setcookie("vericode", $vericode, time()+31556926);
			echo '<meta http-equiv="refresh" content="0;index.php" />';
		}
	} elseif ($_POST['form']=='register') {
		$n = 0;
		$vericode = '';
		while ($n<32) {
			$vericode = $vericode.''.dechex(rand(0,15));
			$n++;
		}
		mysql_query("INSERT INTO users (user, password, vericode) VALUES ('$user', '$pass', '$vericode')");
		setcookie("user", $_POST['user'], time()+31556926);
		setcookie("vericode", $vericode, time()+31556926);
		echo '<meta http-equiv="refresh" content="0;index.php" />';
	} else {
		echo '<meta http-equiv="refresh" content="0;login.php" />';
	}
} elseif (!isset($_GET['redirect'])) {
	echo '<meta http-equiv="refresh" content="0;login.php?redirect" />';
}

if (!isset($user)) {
	$user = 'guest';
}

if (isset($_POST['form'])) {
	if ($_POST['form']=='post'&&isset($_POST['content'])) {
		$content = htmlspecialchars($_POST['content'], ENT_QUOTES);
		$timestamp = time();
		mysql_query("INSERT INTO posts (user_id, content, timestamp, deleted) VALUES ('$user_id', '$content', '$timestamp', 'false')") or die(mysql_error());
		echo '<meta http-equiv="refresh" content="0;index.php" />';
	}
}

if (isset($_GET['action'])) {
	if ($_GET['action']=='logout') {
		setcookie('user', '', time()-1);
		setcookie('vericode', '', time()-1);
		echo '<meta http-equiv="refresh" content="0;index.php" />';
	}
}

if (isset($_GET['delete'])) {
	$id = $_GET['delete'];
	$query = mysql_query("SELECT * FROM posts WHERE id='$id'");
	if ($query!=FALSE) {
		while ($row=mysql_fetch_array($query)) {
			if ($user_id==$row['user_id']) {
				mysql_query("UPDATE posts SET deleted='true' WHERE id='$id'");
				if (isset($_GET['redirect'])) {
					$redirect = $_GET['redirect'];
					if ($redirect=='user') {
						echo '<meta http-equiv="refresh" content="0;user.php?user='.$user_id.'" />';
					}
				} else {
					echo '<meta http-equiv="refresh" content="0;index.php" />';
				}
			}
		}
	}
}

if (isset($req_rank)) {
	if ($rank>$req_rank) {
		echo '<meta http-equiv="refresh" content="0;index.php" />';
	}
}

include 'head.php';
include 'body.php';
?>`,head_default=`<?php
$head = '<link rel="stylesheet" href="style.css" />
<title>Poster</title>';
?>`,site_default=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<?php
		$query = mysql_query("SELECT * FROM posts WHERE deleted='false' ORDER BY id DESC");
		if ($query!=FALSE) {
			while ($row=mysql_fetch_array($query)) {
				if ($user_id==$row['user_id']) {
					$options = '<a href="index.php?delete='.$row['id'].'">Delete</a> ~ ';
				} else {
					$options = '';
				}
								
				$options = $options.date('jS \\o\\f F, Y \\a\\t g:ia', $row['timestamp']+10*3600);
				
				$poster_id = $row['user_id'];
				$info_query = mysql_query("SELECT * FROM users WHERE id='$poster_id'");
				while($info=mysql_fetch_array($info_query)) {
					$poster = $info['user'];
				}
				
				echo '<div class="post"><div class="left"><a href="user.php?user='.$poster_id.'">'.$poster.'</a></div><div class="right">'.$options.'</div><div class="content">'.$row['content'].'</div></div><br />';
			}
		}
		?>
		<?php echo $body_end; ?>
	</body>
</html>`,login_default=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<div class="table">
			<table>
				<tr>
					<td colspan="2">
						<form action="global.php?redirect" method="POST">
						<input type="hidden" name="form" value="login" />
						<input type="text" class="input" name="user" placeholder="Username" />
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<input type="password" class="input" name="pass" placeholder="Password" />
					</td>
				</tr>
				<tr>
					<td>
						<input type="submit" class="submit" value="Login" />
						</form>
					</td>
					<td>
						<form action="register.php?redirect" method="POST">
						<input type="submit" class="submit" value="Register" />
						</form>
					</td>
				</tr>
			</table>
		</div>
		<?php echo $body_end; ?>
	</body>
</html>`,logout_default=`<?php
include 'global.php';
?>
<html>
<head>
<?php echo $head; ?>
</head>
<body>
<?php echo $body_start; ?>

<?php echo $boy_end; ?>
</body>
</html>`,post_default=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<div class="table">
			<form action="index.php?redirect" method="POST">
			<input type="hidden" name="form" value="post" />
			<input type="text" class="input" name="content" placeholder="Content" />
			<input type="submit" class="submit" value="Post" />
			</form>
		</div>
		<?php echo $body_end; ?>
	</body>
</html>`,register_default=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<div class="table">
			<table>
				<tr>
					<td colspan="2">
						<form action="global.php?redirect" method="POST">
						<input type="hidden" name="form" value="register" />
						<input type="text" class="input "name="user" placeholder="Username" />
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<input type="password" class="input" name="pass" placeholder="Password" />
					</td>
				</tr>
				<tr>
					<td>
						<input type="submit" class="submit" value="Register" />
						</form>
					</td>
					<td>
						<form action="login.php?redirect" method="POST">
						<input type="submit" class="submit" value="Login" />
						</form>
					</td>
				</tr>
			</table>
		</div>
		<?php echo $body_end; ?>
	</body>
</html>`,style_default=`*  {
	border: 0;
	color: #007FFF;
	font-family: Helvetica;
	font-size: 12pt;
	margin: 0;
	padding: 0;
}

a {
	text-decoration: none;
}

input {
	background-color: rgb(255, 255, 255);
	border: 1px solid rgb(255, 170, 50);
	height: 30px;
}

table {
	margin: auto;
}

.container {
	text-align: center;
}

.content {
	background-color: rgb(255, 255, 255);
	border-radius: 3px;
	color: #000000;
	font-weight: normal;
	margin-top: 22px;
	padding: 5px;
}

.input {
	width: 300px;
}

.left {
	float: left;
}

.menu {
	background-color: rgb(255, 170, 50);
	box-shadow: 0 2px 4px 0 rgb(0, 0, 0);
	font-weight: bold;
	overflow: auto;
	padding: 5px;
}

.post {
	background-color: rgb(255, 170, 50);
	border-radius: 5px;
	box-shadow: 2px 2px 4px 0 rgb(0, 0, 0);
	display: inline-block;
	font-weight: bold;
	margin-top: 10px;
	padding: 5px;
	text-align: left;
	width: 75%;
}

.right {
	float: right;
}

.submit {
	width: 149px;
}

.table {
	background-color: rgb(255, 170, 50);
	border-radius: 5px;
	display: inline-block;
	margin-top: 200px;
	padding: 5px;
}

.title {
	font-size: 36pt;
	font-weight: bold;
	margin-top: 10px;
}`,user_default=`<?php
include 'global.php';
?>
<html>
	<head>
		<?php echo $head; ?>
	</head>
	<body>
		<?php echo $body_start; ?>
		<?php
		if (isset($_GET['user'])) {
			$poster_id = $_GET['user'];
			$query = mysql_query("SELECT * FROM users WHERE id='$poster_id'");
			while ($row=mysql_fetch_array($query)) {
				$poster = $row['user'];
			}
			echo '<div class="title">'.$poster.'</div>';
			$query = mysql_query("SELECT * FROM posts WHERE user_id='$poster_id' AND deleted='FALSE'");
			if ($query!=FALSE) {			
				while ($row=mysql_fetch_array($query)) {
					if ($user_id==$row['user_id']) {
						$options = '<a href="index.php?delete='.$row['id'].'&redirect=user">Delete</a> ~ ';
					} else {
						$options = '';
					}
					
					$options = $options.date('jS \\o\\f F, Y \\a\\t g:ia', $row['timestamp']+10*3600);
					
					echo '<div class="post"><div class="left">'.$poster.'</div><div class="right">'.$options.'</div><div class="content">'.$row['content'].'</div></div><br />';
				}
			}
		}
		?>
		<?php echo $body_end; ?>
	</body>
</html>`,variables_default=`<?php
$user = '';
$vericode = '';
$query = '';
$user_id = '';
$rank = '';
$pass = '';
?>`,v$2=`playground-log`,d=(e,...t)=>{T$1.dispatchEvent(new CustomEvent(v$2,{detail:{log:e,args:t}}))},E$2=(e,...t)=>{switch(typeof e.message==`string`?Reflect.set(e,`message`,c$2(e.message)):e.message.message&&typeof e.message.message==`string`&&Reflect.set(e.message,`message`,c$2(e.message.message)),e.severity){case o.Debug:console.debug(e.message,...t);break;case o.Info:console.info(e.message,...t);break;case o.Warn:console.warn(e.message,...t);break;case o.Error:case o.Fatal:console.error(e.message,...t);break;default:console.log(e.message,...t)}},w$1=e=>e instanceof Error?[e.message,e.stack].join(`
`):JSON.stringify(e,null,2),g$1=[],f=e=>{g$1.push(e)},l=e=>{e.raw===!0?f(e.message):f(M$1(typeof e.message==`object`?w$1(e.message):e.message,e.severity,e.prefix??n.JS))},o={Fatal:{name:`fatal`,level:0},Error:{name:`error`,level:1},Warn:{name:`warn`,level:2},Log:{name:`log`,level:3},Info:{name:`info`,level:4},Debug:{name:`debug`,level:5}},n={WASM:`Wasm Crash`,PHP:`PHP`,JS:`JavaScript`},b$1=class extends EventTarget{constructor(e=[]){super(),this.fatalErrorEvent=`playground-fatal-error`,this.severity=o.Info,this.handlers=e}getLogs(){return this.handlers.includes(l)?[...g$1]:(this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`),[])}logMessage(e,...t){let r={...e,severity:e.severity??o.Log};for(let e of this.handlers)r.severity.level<=this.severity.level&&e(r,...t)}setSeverityFilterLevel(e){this.severity=e}log(e,...t){this.logMessage({message:e,severity:o.Log,prefix:n.JS,raw:!1},...t)}debug(e,...t){this.logMessage({message:e,severity:o.Debug,prefix:n.JS,raw:!1},...t)}info(e,...t){this.logMessage({message:e,severity:o.Info,prefix:n.JS,raw:!1},...t)}warn(e,...t){this.logMessage({message:e,severity:o.Warn,prefix:n.JS,raw:!1},...t)}error(e,...t){this.logMessage({message:e,severity:o.Error,prefix:n.JS,raw:!1},...t)}},P$1=()=>[l,E$2,d],T$1=new b$1(P$1()),c$2=e=>e.replace(/\t/g,``),M$1=(e,t,r)=>{let i=new Date,a=new Intl.DateTimeFormat(`en-GB`,{year:`numeric`,month:`short`,day:`2-digit`,timeZone:`UTC`}).format(i).replace(/ /g,`-`),s=new Intl.DateTimeFormat(`en-GB`,{hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!1,timeZone:`UTC`,timeZoneName:`short`}).format(i),O=a+` `+s;return e=c$2(e),`[${O}] ${r} ${t.name}: ${e}`},w=Symbol(`SleepFinished`);function p(e){return new Promise(t=>{setTimeout(()=>t(w),e)})}var b=class extends Error{constructor(){super(`Acquiring lock timed out`)}},v$1=class{constructor({concurrency:e,timeout:t}){this._running=0,this.concurrency=e,this.timeout=t,this.queue=[]}get remaining(){return this.concurrency-this.running}get running(){return this._running}async acquire(){if(this._running>=this.concurrency){let e=new Promise(e=>{this.queue.push(e)});if(this.timeout!==void 0){let t=this.queue.at(-1);if(await Promise.race([e,p(this.timeout)])===w)throw this.queue.splice(this.queue.indexOf(t),1),new b}else await e}this._running++;let e=!1;return()=>{e||(e=!0,this._running--,this.queue.length>0&&this.queue.shift()())}}async run(e){let t=await this.acquire();try{return await e()}finally{t()}}};function m(...e){function t(e){return e.substring(e.length-1)===`/`}let r=e.join(`/`),i=r[0]===`/`,a=t(r);return r=c$1(r),!r&&!i&&(r=`.`),r&&a&&!t(r)&&(r+=`/`),r}function I$1(e,t){if(e.includes(`\0`)||t.includes(`\0`))return;let r=c$1(t);if(!r)return;let i=c$1(e.startsWith(`/`)?e:m(r,e));if(i!==r&&P(r,i))return i}function W$1(e){if(e===`/`)return`/`;e=c$1(e);let t=e.lastIndexOf(`/`);return t===-1?``:t===0?`/`:e.substr(0,t)}function j$1(e){if(e===`/`)return`/`;e=c$1(e);let t=e.lastIndexOf(`/`);return t===-1?e:e.substr(t+1)}function c$1(e){let t=e[0]===`/`;return e=E$1(e.split(`/`).filter(e=>!!e),!t).join(`/`),(t?`/`:``)+e.replace(/\/$/,``)}function E$1(e,t){let r=0;for(let t=e.length-1;t>=0;t--){let i=e[t];i===`.`?e.splice(t,1):i===`..`?(e.splice(t,1),r++):r&&(e.splice(t,1),r--)}if(t)for(;r;r--)e.unshift(`..`);return e}function P(e,t){return e===`/`||(e=c$1(e),t=c$1(t),t.startsWith(e+`/`)||t===e)}var g=class{constructor(){this.listeners={}}emit(e,t){this.listeners[e]&&this.listeners[e].forEach(function(e){e(t)})}on(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)}once(e,t){let r=(...i)=>{this.off(e,r),t(...i)};this.on(e,r)}off(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(e=>e!==t))}};function x$1(e){let t=0,r=``,i=[],a=``;for(let s=0;s<e.length;s++){let O=e[s];O===`\\`?((e[s+1]===`"`||e[s+1]===`'`)&&s++,a+=e[s]):t===0?O===`"`||O===`'`?(t=1,r=O):O.match(/\s/)?(a.trim().length&&i.push(a.trim()),a=O):i.length&&!a?a=i.pop()+O:a+=O:t===1&&(O===r?(t=0,r=``):a+=O)}return a&&i.push(a.trim()),i}var h=class extends g{constructor(e){if(super(),this.buffer=[],this.writing=!1,this.ended=!1,this.length=0,!e.write)throw Error(`WritablePolyfill requires write option`);this._write=e.write,this.highWaterMark=e.highWaterMark??16384,this.decodeStrings=e.decodeStrings??!0,this.defaultEncoding=e.defaultEncoding??`utf8`,this.defer=typeof queueMicrotask==`function`?queueMicrotask:e=>setTimeout(e,0)}write(e,t=this.defaultEncoding,r=()=>{}){if(typeof t==`function`&&(r=t,t=this.defaultEncoding),this.ended){let e=Error(`write after end`);return(0,this.defer)(()=>r(e)),this.emit(`error`,e),!1}if(this.decodeStrings&&typeof e==`string`){if(typeof Buffer<`u`&&typeof Buffer.from==`function`)e=Buffer.from(e,t);else if(typeof TextEncoder<`u`)e=new TextEncoder().encode(e);else throw Error(`String chunks are not supported in this environment: Buffer and TextEncoder are unavailable.`);t=`buffer`}this.length+=e.length??1;let i=this.length>=this.highWaterMark;return this.buffer.push({chunk:e,encoding:t,cb:r}),this.writing||this._clearBuffer(),!i}end(e,t,r){typeof e==`function`?(r=e,e=void 0):typeof t==`function`&&(r=t,t=void 0),e!==void 0&&this.write(e,t,()=>{}),this.ended=!0,this.writing||this._clearBuffer(),r&&this.defer(r)}cork(){}uncork(){}setDefaultEncoding(e){return this.defaultEncoding=e,this}_clearBuffer(){let e=this.buffer.shift();e?(this.writing=!0,this._write(e.chunk,e.encoding,t=>{this.writing=!1,this.length-=e.chunk.length??1,t&&this.emit(`error`,t),e.cb(t),this.buffer.length?this._clearBuffer():(this.length<this.highWaterMark&&this.emit(`drain`),this.ended&&this.emit(`finish`))})):this.ended&&this.emit(`finish`)}};function S$1(e){return function(t,r=[],i={}){let a=new T,s=new _$1(a);return setTimeout(async()=>{let O=[];if(r.length)O=[t,...r];else if(typeof t==`string`)O=x$1(t);else if(Array.isArray(t))O=t;else throw Error(`Invalid command `,t);try{let t=e(O,s,i);if(typeof t!=`object`||!t||!(`then`in t))throw Error(`The program callback passed to createSpawnHandler() did not return a promise. It indicates there's a bug in your code. The callback must return a promise. PHP cannot interact with program that synchronously exists at the end of the proc_open() call. All the streams would be closed already. Make sure to put an "await new Promise(resolve => setTimeout(resolve, 1))before calling processApi.exit(0) in your callback to let PHP catch up with the stdout data.`);if(s.exited)throw Error(`The program callback passed to createSpawnHandler() exited synchronously. It indicates there's a bug in your code. The callback must return a promise. PHP cannot interact with program that synchronously exists at the end of the proc_open() call. All the streams would be closed already. Make sure to put an "await new Promise(resolve => setTimeout(resolve, 1))before calling processApi.exit(0) in your callback to let PHP catch up with the stdout data.`);a.emit(`spawn`,!0),await t}catch(e){a.emit(`error`,e),typeof e==`object`&&e&&`message`in e&&typeof e.message==`string`&&s.stderr(e.message),s.exit(1)}}),a}}var _$1=class extends g{constructor(e){super(),this.exited=!1,this.stdinBuffer=[],this.childProcess=e,e.on(`stdin`,e=>{this.stdinBuffer?this.stdinBuffer.push(e.slice()):this.emit(`stdin`,e)})}stdinEnd(){this.childProcess.stdin.ended||this.childProcess.stdin.end()}stdout(e){this.childProcess.stdout.write(e)}stdoutEnd(){this.childProcess.stdout.ended||this.childProcess.stdout.end()}stderr(e){this.childProcess.stderr.write(e)}stderrEnd(){this.childProcess.stderr.ended||this.childProcess.stderr.end()}notifySpawn(){this.childProcess.emit(`spawn`,!0)}exit(e){this.exited||(this.exited=!0,this.stdinEnd(),this.stdoutEnd(),this.stderrEnd(),this.childProcess.emit(`exit`,e))}on(e,t){if(super.on(e,t),e===`stdin`&&this.stdinBuffer){for(let e=0;e<this.stdinBuffer.length;e++)this.emit(`stdin`,this.stdinBuffer[e]);this.stdinBuffer=null}}},M=9743,T=class extends g{constructor(e=M++){super(),this.pid=e;let t=this;this.stdout=new h({write(e,r,i){t.stdout.emit(`data`,e),i()}}),this.stderr=new h({write:(e,r,i)=>{t.stderr.emit(`data`,e),i()}}),this.stdin=new h({write:(e,r,i)=>{t.emit(`stdin`,e),i()}})}},A$1=Symbol.for(`@php-wasm/php-event-stdin-transfer`),require_ini=__commonJSMin(((e,t)=>{var{hasOwnProperty:r}=Object.prototype,i=(e,t={})=>{typeof t==`string`&&(t={section:t}),t.align=t.align===!0,t.newline=t.newline===!0,t.sort=t.sort===!0,t.whitespace=t.whitespace===!0||t.align===!0,t.platform=t.platform||typeof process<`u`&&process.platform,t.bracketedArray=t.bracketedArray!==!1;let r=t.platform===`win32`?`\r
`:`
`,s=t.whitespace?` = `:`=`,O=[],F=t.sort?Object.keys(e).sort():Object.keys(e),L=0;t.align&&(L=N(F.filter(t=>e[t]===null||Array.isArray(e[t])||typeof e[t]!=`object`).map(t=>Array.isArray(e[t])?`${t}[]`:t).concat([``]).reduce((e,t)=>N(e).length>=N(t).length?e:t)).length);let B=``,q=t.bracketedArray?`[]`:``;for(let t of F){let i=e[t];if(i&&Array.isArray(i))for(let e of i)B+=N(`${t}${q}`).padEnd(L,` `)+s+N(e)+r;else i&&typeof i==`object`?O.push(t):B+=N(t).padEnd(L,` `)+s+N(i)+r}t.section&&B.length&&(B=`[`+N(t.section)+`]`+(t.newline?r+r:r)+B);for(let s of O){let O=a(s,`.`).join(`\\.`),N=(t.section?t.section+`.`:``)+O,F=i(e[s],{...t,section:N});B.length&&F.length&&(B+=r),B+=F}return B};function a(e,t){var r=0,i=0,a=0,s=[];do if(a=e.indexOf(t,r),a!==-1){if(r=a+t.length,a>0&&e[a-1]===`\\`)continue;s.push(e.slice(i,a)),i=a+t.length}while(a!==-1);return s.push(e.slice(i)),s}var s=(e,t={})=>{t.bracketedArray=t.bracketedArray!==!1;let i=Object.create(null),s=i,O=null,N=/^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i,L=e.split(/[\r\n]+/g),B={};for(let e of L){if(!e||e.match(/^\s*[;#]/)||e.match(/^\s*$/))continue;let a=e.match(N);if(!a)continue;if(a[1]!==void 0){if(O=F(a[1]),O===`__proto__`){s=Object.create(null);continue}s=i[O]=i[O]||Object.create(null);continue}let L=F(a[2]),q;t.bracketedArray?q=L.length>2&&L.slice(-2)===`[]`:(B[L]=(B?.[L]||0)+1,q=B[L]>1);let $=q?L.slice(0,-2):L;if($===`__proto__`)continue;let ae=!a[3]||F(a[4]),ce=ae===`true`||ae===`false`||ae===`null`?JSON.parse(ae):ae;q&&(r.call(s,$)?Array.isArray(s[$])||(s[$]=[s[$]]):s[$]=[]),Array.isArray(s[$])?s[$].push(ce):s[$]=ce}let q=[];for(let e of Object.keys(i)){if(!r.call(i,e)||typeof i[e]!=`object`||Array.isArray(i[e]))continue;let t=a(e,`.`);s=i;let O=t.pop(),N=O.replace(/\\\./g,`.`);for(let e of t)e!==`__proto__`&&(r.call(s,e)&&typeof s[e]==`object`||(s[e]=Object.create(null)),s=s[e]);(s!==i||N!==O)&&(s[N]=i[e],q.push(e))}for(let e of q)delete i[e];return i},O=e=>e.startsWith(`"`)&&e.endsWith(`"`)||e.startsWith(`'`)&&e.endsWith(`'`),N=e=>typeof e!=`string`||e.match(/[=\r\n]/)||e.match(/^\[/)||e.length>1&&O(e)||e!==e.trim()?JSON.stringify(e):e.split(`;`).join(`\\;`).split(`#`).join(`\\#`),F=e=>{if(e=(e||``).trim(),O(e)){e.charAt(0)===`'`&&(e=e.slice(1,-1));try{e=JSON.parse(e)}catch{}}else{let t=!1,r=``;for(let i=0,a=e.length;i<a;i++){let a=e.charAt(i);if(t)`\\;#`.indexOf(a)===-1?r+=`\\`+a:r+=a,t=!1;else if(`;#`.indexOf(a)!==-1)break;else a===`\\`?t=!0:r+=a}return t&&(r+=`\\`),r.trim()}return e};t.exports={parse:s,decode:s,stringify:i,encode:i,safe:N,unsafe:F}})),import_ini=require_ini();function U(...e){let t=new Uint8Array(e.reduce((e,t)=>e+t.length,0)),r=0;for(let i of e)t.set(i,r),r+=i.length;return t}function S(e){if(e===void 0){let e=new Uint8Array;return new TransformStream({transform(t){e=U(e,t)},flush(t){t.enqueue(e)}})}{let t=new ArrayBuffer(e||0),r=0;return new TransformStream({transform(e){new Uint8Array(t).set(e,r),r+=e.byteLength},flush(e){e.enqueue(new Uint8Array(t))}})}}function A(e,t){if(t===0)return new ReadableStream({start(e){e.close()}});let r=e.getReader({mode:`byob`}),i=0;return new ReadableStream({async pull(e){let{value:a,done:s}=await r.read(new Uint8Array(t-i));s?(r.releaseLock(),e.close()):(i+=a.length,e.enqueue(a),i>=t&&(r.releaseLock(),e.close()))},cancel(){r.cancel()}})}async function c(e,t){return t!==void 0&&(e=A(e,t)),await e.pipeThrough(S(t)).getReader().read().then(({value:e})=>e)}var E=class e extends File{static fromArrayBuffer(t,r,i){return new e(new ReadableStream({start(e){e.enqueue(new Uint8Array(t)),e.close()}}),r,i)}constructor(e,t,r){super([],t,{type:r?.type}),this.readableStream=e,this.filesize=r?.filesize}slice(){throw Error(`slice() is not possible on a StreamedFile`)}stream(){return this.readableStream}async text(){return new TextDecoder().decode(await this.arrayBuffer())}async arrayBuffer(){return await c(this.stream())}};ReadableStream.prototype[Symbol.asyncIterator]||(ReadableStream.prototype[Symbol.asyncIterator]=async function*(){let e=this.getReader();try{for(;;){let{done:t,value:r}=await e.read();if(t)return;yield r}}finally{e.releaseLock()}},ReadableStream.prototype.iterate=ReadableStream.prototype[Symbol.asyncIterator]);var H=new v$1({concurrency:10}),scriptRel=`modulepreload`,assetsURL=function(e){return`/gallery/`+e},seen={},failedCssLinks={},isCssPreloadUrl=function(e){return e.pathname.endsWith(`.css`)},preloadOnce=function(e,t,r){if(t in e)return e[t];let i=r();if(!i){e[t]=void 0;return}let a=i.then(()=>{e[t]=void 0},r=>{throw delete e[t],r});return e[t]=a,a},__vitePreload=function(e,t,r){let i=Promise.resolve();if(t&&t.length>0){let e,a=document.querySelector(`meta[property=csp-nonce]`),s=a?.nonce||a?.getAttribute(`nonce`);function O(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function N(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}i=O(t.map(t=>{t=assetsURL(t,r);let i=N(t),a=isCssPreloadUrl(i);return preloadOnce(seen,i.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let r=t.length-1;r>=0;r--){let i=t[r];e.all.add(i.href),i.rel===`stylesheet`&&e.styles.add(i.href)}}let t=a?e.styles:e.all,r=a?failedCssLinks[i.href]:void 0;if(!r&&t.has(i.href))return;let O=document.createElement(`link`);if(O.rel=a?`stylesheet`:scriptRel,a||(O.as=`script`),O.crossOrigin=``,O.href=i.href,s&&O.setAttribute(`nonce`,s),r&&delete failedCssLinks[i.href],r?.isConnected?r.replaceWith(O):document.head.appendChild(O),a)return new Promise((e,t)=>{let r=a=>{O.removeEventListener(`load`,r),O.removeEventListener(`error`,r),a.type===`error`?(failedCssLinks[i.href]=O,t(Error(`Unable to preload CSS for ${i}`))):e(a)};O.addEventListener(`load`,r),O.addEventListener(`error`,r)})})}).filter(e=>e!==void 0))}function a(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return i.then(t=>{for(let e of t||[])e.status===`rejected`&&a(e.reason);return e().catch(a)})},ve=e=>{throw TypeError(e)},me=(e,t,r)=>t.has(e)||ve(`Cannot `+r),u=(e,t,r)=>(me(e,t,`read from private field`),r?r.call(e):t.get(e)),_=(e,t,r)=>t.has(e)?ve(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,r),x=(e,t,r,i)=>(me(e,t,`write to private field`),i?i.call(e,r):t.set(e,r),r),v=(e,t,r)=>(me(e,t,`access private method`),r),ErrnoError=class extends Error{constructor(e,t,r){super(t,r),this.name=`ErrnoError`,this.errno=e}},FileErrorCodes={0:`No error occurred. System call completed successfully.`,1:`Argument list too long.`,2:`Permission denied.`,3:`Address in use.`,4:`Address not available.`,5:`Address family not supported.`,6:`Resource unavailable, or operation would block.`,7:`Connection already in progress.`,8:`Bad file descriptor.`,9:`Bad message.`,10:`Device or resource busy.`,11:`Operation canceled.`,12:`No child processes.`,13:`Connection aborted.`,14:`Connection refused.`,15:`Connection reset.`,16:`Resource deadlock would occur.`,17:`Destination address required.`,18:`Mathematics argument out of domain of function.`,19:`Reserved.`,20:`File exists.`,21:`Bad address.`,22:`File too large.`,23:`Host is unreachable.`,24:`Identifier removed.`,25:`Illegal byte sequence.`,26:`Operation in progress.`,27:`Interrupted function.`,28:`Invalid argument.`,29:`I/O error.`,30:`Socket is connected.`,31:`There is a directory under that path.`,32:`Too many levels of symbolic links.`,33:`File descriptor value too large.`,34:`Too many links.`,35:`Message too large.`,36:`Reserved.`,37:`Filename too long.`,38:`Network is down.`,39:`Connection aborted by network.`,40:`Network unreachable.`,41:`Too many files open in system.`,42:`No buffer space available.`,43:`No such device.`,44:`There is no such file or directory OR the parent directory does not exist.`,45:`Executable file format error.`,46:`No locks available.`,47:`Reserved.`,48:`Not enough space.`,49:`No message of the desired type.`,50:`Protocol not available.`,51:`No space left on device.`,52:`Function not supported.`,53:`The socket is not connected.`,54:`Not a directory or a symbolic link to a directory.`,55:`Directory not empty.`,56:`State not recoverable.`,57:`Not a socket.`,58:`Not supported, or operation not supported on socket.`,59:`Inappropriate I/O control operation.`,60:`No such device or address.`,61:`Value too large to be stored in data type.`,62:`Previous owner died.`,63:`Operation not permitted.`,64:`Broken pipe.`,65:`Protocol error.`,66:`Protocol not supported.`,67:`Protocol wrong type for socket.`,68:`Result too large.`,69:`Read-only file system.`,70:`Invalid seek.`,71:`No such process.`,72:`Reserved.`,73:`Connection timed out.`,74:`Text file busy.`,75:`Cross-device link.`,76:`Extension: Capabilities insufficient.`};function getEmscriptenFsError(e){let t=typeof e==`object`?e?.errno:null;if(t in FileErrorCodes)return FileErrorCodes[t]}function rethrowFileSystemError(e=``){return function(t){return function(...r){try{return t.apply(this,r)}catch(t){let i=typeof t==`object`?t?.errno:null;if(i in FileErrorCodes){let a=FileErrorCodes[i],s=typeof r[1]==`string`?r[1]:null;throw new ErrnoError(i,`${s===null?e:e.replaceAll(`{path}`,s)}: ${a}`,{cause:t})}throw t}}}}var FSHelpers=class e{static readFileAsText(t,r){return new TextDecoder().decode(e.readFileAsBuffer(t,r))}static readFileAsBuffer(e,t){return e.readFile(t)}static writeFile(e,t,r){e.writeFile(t,r)}static unlink(e,t){e.unlink(t)}static mv(t,r,i){try{let a=t.lookupPath(r).node.mount,s=e.fileExists(t,i)?t.lookupPath(i).node.mount:t.lookupPath(W$1(i)).node.mount;a.mountpoint===s.mountpoint?t.rename(r,i):(e.copyRecursive(t,r,i),e.isDir(t,r)?e.rmdir(t,r,{recursive:!0}):t.unlink(r))}catch(e){let t=getEmscriptenFsError(e);throw t?Error(`Could not move ${r} to ${i}: ${t}`,{cause:e}):e}}static rmdir(t,r,i={recursive:!0}){if(t.lookupPath(r,{follow:!1})?.node.mount.mountpoint===r)throw new ErrnoError(10);i!=null&&i.recursive&&e.listFiles(t,r).forEach(a=>{let s=`${r}/${a}`;!e.isSymlink(t,s)&&e.isDir(t,s)?e.rmdir(t,s,i):e.unlink(t,s)}),t.getPath(t.lookupPath(r).node)===t.cwd()&&t.chdir(m(t.cwd(),`..`)),t.rmdir(r)}static listFiles(t,r,i={prependPath:!1}){if(!e.fileExists(t,r))return[];try{let e=t.readdir(r).filter(e=>e!==`.`&&e!==`..`);if(i.prependPath){let t=r.replace(/\/$/,``);return e.map(e=>`${t}/${e}`)}return e}catch(e){return T$1.error(e,{path:r}),[]}}static isDir(t,r){return e.fileExists(t,r)?t.isDir(t.lookupPath(r,{follow:!0}).node.mode):!1}static isFile(t,r){return e.fileExists(t,r)?t.isFile(t.lookupPath(r,{follow:!0}).node.mode):!1}static symlink(e,t,r){return e.symlink(t,r)}static isSymlink(t,r){return e.fileExists(t,r)?t.isLink(t.lookupPath(r).node.mode):!1}static readlink(e,t){return e.readlink(t)}static realpath(e,t){return e.lookupPath(t,{follow:!0}).path}static fileExists(e,t){try{return e.lookupPath(t),!0}catch{return!1}}static mkdir(e,t){e.mkdirTree(t)}static copyRecursive(t,r,i){try{let a=t.lookupPath(r).node;if(t.isDir(a.mode)){if(r===i||i.startsWith(`${r}/`))throw new ErrnoError(28);t.mkdirTree(i);let a=t.readdir(r).filter(e=>e!==`.`&&e!==`..`);for(let s of a)e.copyRecursive(t,m(r,s),m(i,s))}else t.isLink(a.mode)?t.symlink(t.readlink(r),i):t.writeFile(i,t.readFile(r))}catch(e){let t=getEmscriptenFsError(e);throw t?Error(`Could not copy ${r} to ${i}: ${t}`,{cause:e}):e}}};FSHelpers.readFileAsText=rethrowFileSystemError(`Could not read "{path}"`)(FSHelpers.readFileAsText),FSHelpers.readFileAsBuffer=rethrowFileSystemError(`Could not read "{path}"`)(FSHelpers.readFileAsBuffer),FSHelpers.writeFile=rethrowFileSystemError(`Could not write to "{path}"`)(FSHelpers.writeFile),FSHelpers.unlink=rethrowFileSystemError(`Could not unlink "{path}"`)(FSHelpers.unlink),FSHelpers.rmdir=rethrowFileSystemError(`Could not remove directory "{path}"`)(FSHelpers.rmdir),FSHelpers.listFiles=rethrowFileSystemError(`Could not list files in "{path}"`)(FSHelpers.listFiles),FSHelpers.isDir=rethrowFileSystemError(`Could not stat "{path}"`)(FSHelpers.isDir),FSHelpers.isFile=rethrowFileSystemError(`Could not stat "{path}"`)(FSHelpers.isFile),FSHelpers.realpath=rethrowFileSystemError(`Could not stat "{path}"`)(FSHelpers.realpath),FSHelpers.fileExists=rethrowFileSystemError(`Could not stat "{path}"`)(FSHelpers.fileExists),FSHelpers.mkdir=rethrowFileSystemError(`Could not create directory "{path}"`)(FSHelpers.mkdir);var _private=new WeakMap,D,Y,PHPWorker=class{constructor(e,t){_(this,D),_(this,Y),this.absoluteUrl=``,this.documentRoot=``,this.chroot=null,x(this,D,new Map),x(this,Y,new WeakSet),this.onMessageListeners=[],_private.set(this,{monitor:t}),e&&this.__internal_setRequestHandler(e)}__internal_setRequestHandler(e){this.absoluteUrl=e.absoluteUrl,this.documentRoot=e.documentRoot,this.chroot=this.documentRoot,_private.set(this,{..._private.get(this),requestHandler:e})}__internal_getPHP(){return _private.get(this).php}__internal_getRequestHandler(){return this.getRequestHandler()}async setPrimaryPHP(e){_private.set(this,{..._private.get(this),php:e})}pathToInternalUrl(e){return this.getRequestHandler().pathToInternalUrl(e)}internalUrlToPath(e){return this.getRequestHandler().internalUrlToPath(e)}async onDownloadProgress(e){var t;return _private.get(this).monitor?.addEventListener(`progress`,e)}async mv(e,t){return _private.get(this).php.mv(e,t)}async cp(e,t){return _private.get(this).php.cp(e,t)}async rmdir(e,t){return _private.get(this).php.rmdir(e,t)}async request(e){return await this.getRequestHandler().request(e)}async requestStreamed(e){return await this.getRequestHandler().requestStreamed(e)}async run(e){let t=_private.get(this),r=t.php;if(r&&(e.usePrimaryPhp||!t.requestHandler&&!r.requestHandler))return this.registerWorkerListeners(r),await r.run(e);let{php:i,reap:a}=await this.acquirePHPInstance();try{return await i.run(e)}finally{a()}}async runStream(e){let t=_private.get(this),r=t.php;if(r&&(e.usePrimaryPhp||!t.requestHandler&&!r.requestHandler))return this.registerWorkerListeners(r),await r.runStream(e);let{php:i,reap:a}=await this.acquirePHPInstance(),s;try{s=await i.runStream(e)}catch(e){throw a(),e}return s.finished.finally(a),s}async cli(e,t){let r=_private.get(this),i=r.php;if(!r.requestHandler&&!(i!=null&&i.requestHandler)&&i)return await i.cli(e,t);let{php:a,reap:s}=await this.acquirePHPInstance(),O;try{O=await a.cli(e,t)}catch(e){throw s(),e}return O.finished.finally(s),O}chdir(e){return this.chroot=e,_private.get(this).php.chdir(e)}cwd(){return _private.get(this).php.cwd()}async acquirePHPInstance(){let{php:e,reap:t}=await this.getRequestHandler().instanceManager.acquirePHPInstance();return this.chroot!==null&&e.chdir(this.chroot),this.registerWorkerListeners(e),{php:e,reap:t}}setSapiName(e){_private.get(this).php.setSapiName(e)}mkdir(e){return _private.get(this).php.mkdir(e)}mkdirTree(e){return _private.get(this).php.mkdirTree(e)}readFileAsText(e){return _private.get(this).php.readFileAsText(e)}readFileAsBuffer(e){return _private.get(this).php.readFileAsBuffer(e)}writeFile(e,t){return _private.get(this).php.writeFile(e,t)}unlink(e){return _private.get(this).php.unlink(e)}listFiles(e,t){return _private.get(this).php.listFiles(e,t)}isDir(e){return _private.get(this).php.isDir(e)}isFile(e){return _private.get(this).php.isFile(e)}fileExists(e){return _private.get(this).php.fileExists(e)}onMessage(e){return this.onMessageListeners.push(e),async()=>{this.onMessageListeners=this.onMessageListeners.filter(t=>t!==e)}}defineConstant(e,t){_private.get(this).php.defineConstant(e,t)}addEventListener(e,t){u(this,D).has(e)||u(this,D).set(e,new Set),u(this,D).get(e).add(t)}removeEventListener(e,t){var r;(r=u(this,D).get(e))==null||r.delete(t)}dispatchEvent(e){let t=u(this,D).get(e.type);if(!t)return;let r=[...t],i=A$1 in e&&e[A$1]===!0&&`stdin`in e&&typeof ReadableStream<`u`&&e.stdin instanceof ReadableStream;if(r.length>1&&i){let t=e.stdin;for(let i=0;i<r.length-1;i++){let[a,s]=t.tee();t=s,r[i]({...e,stdin:a})}r[r.length-1]({...e,stdin:t})}else for(let t of r)t(e)}registerWorkerListeners(e){u(this,Y).has(e)||(u(this,Y).add(e),e.addEventListener(`*`,async e=>{this.dispatchEvent(e)}),e.onMessage(async e=>{for(let t of this.onMessageListeners){let r=await t(e);if(r)return r}return``}))}async[Symbol.asyncDispose](){var e;await this.getRequestHandler(!1)?.[Symbol.asyncDispose]()}getRequestHandler(e=!0){var t;let r=_private.get(this);if(r.requestHandler)return r.requestHandler;if((t=r.php)!=null&&t.requestHandler)return this.__internal_setRequestHandler(r.php.requestHandler),r.php.requestHandler;if(e)throw Error(`PHPWorker is not connected to a request handler.`)}};D=new WeakMap,Y=new WeakMap;function isExitCode(e){return e instanceof Error&&e?.name===`ExitStatus`&&`status`in e}var RuntimeId=Symbol(`RuntimeId`),loadedRuntimes=new Map,lastRuntimeId=0;async function loadPHPRuntime(e,...t){let r=Object.assign({},...t),[i,a,s]=makePromise(),O=e.init(currentJsRuntime,{onAbort(e){s(e),T$1.error(e)},ENV:{},locateFile:e=>e,...r,noInitialRun:!0,onRuntimeInitialized(){r.onRuntimeInitialized&&r.onRuntimeInitialized(O),a()}});await i;let N=r.phpWasmAsyncMode??e.phpWasmAsyncMode;N&&(O.phpWasmAsyncMode=N);let F=++lastRuntimeId;return O.FS,O.id=F,O.originalExit=O._exit,O._exit=function(e){return O.outboundNetworkProxyServer&&(O.outboundNetworkProxyServer.close(),O.outboundNetworkProxyServer.closeAllConnections()),loadedRuntimes.delete(F),O.originalExit(e)},O[RuntimeId]=F,loadedRuntimes.set(F,O),F}function popLoadedRuntime(e,{dangerouslyKeepTheRuntimeInTheMap:t=!1}={}){var r;let i=loadedRuntimes.get(e);if(!i)throw Error(`Runtime with id ${e} not found`);if(t){if(!((r=process==null?void 0:{})!=null&&r.TEST))throw Error(`Cannot pop runtime in non-test environment`);return i}return loadedRuntimes.delete(e),i}var currentJsRuntime=function(){var e;return typeof process<`u`&&process.release?.name===`node`?`NODE`:typeof window<`u`?`WEB`:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?`WORKER`:`NODE`}(),makePromise=()=>{let e=[],t=new Promise((t,r)=>{e.push(t,r)});return e.unshift(t),e},responseTexts={500:`Internal Server Error`,502:`Bad Gateway`,404:`Not Found`,403:`Forbidden`,401:`Unauthorized`,400:`Bad Request`,301:`Moved Permanently`,302:`Found`,307:`Temporary Redirect`,308:`Permanent Redirect`,204:`No Content`,201:`Created`,200:`OK`},re,se,de=class e{constructor(e,t,r,i){_(this,re),_(this,se),this.cachedParsedHeaders=null,this.cachedStdoutBytes=null,this.cachedStderrText=null;let[a,s]=e.tee();x(this,re,a),x(this,se,s),this.stdout=t,this.stderr=r,this.exitCode=i}static fromPHPResponse(t){let r=new ReadableStream({start(e){e.enqueue(t.bytes),e.close()}}),i=[];for(let[e,r]of Object.entries(t.headers))for(let t of r)i.push(`${e}: ${t}`);let a=JSON.stringify({status:t.httpStatusCode,headers:i}),s=new ReadableStream({start(e){e.enqueue(new TextEncoder().encode(a)),e.close()}}),O=new ReadableStream({start(e){t.errors.length>0&&e.enqueue(new TextEncoder().encode(t.errors)),e.close()}});return new e(s,r,O,Promise.resolve(t.exitCode))}static forHttpCode(t,r=``){return e.fromPHPResponse(PHPResponse.forHttpCode(t,r))}getHeadersStream(){return u(this,re)}async ok(){try{let e=await this.httpStatusCode;return e>=200&&e<400}catch{return!1}}get finished(){return Promise.allSettled([this.exitCode.finally(()=>{})]).then(()=>{})}get headers(){return this.getParsedHeaders().then(e=>e.headers)}get httpStatusCode(){return this.getParsedHeaders().then(e=>e.httpStatusCode).then(e=>e===void 0?this.getParsedHeaders().then(e=>e.httpStatusCode,()=>200):e).catch(()=>500)}get stdoutText(){return this.stdoutBytes.then(e=>new TextDecoder().decode(e))}get stdoutBytes(){return this.cachedStdoutBytes||=streamToBytes(this.stdout),this.cachedStdoutBytes}get stderrText(){return this.cachedStderrText||=streamToText(this.stderr),this.cachedStderrText}async getParsedHeaders(){return this.cachedParsedHeaders||=parseHeadersStream(u(this,se)),await this.cachedParsedHeaders}};re=new WeakMap,se=new WeakMap;var StreamedPHPResponse=de;async function parseHeadersStream(e){let t=await streamToText(e),r;try{r=JSON.parse(t)}catch{return{headers:{},httpStatusCode:200}}let i={};for(let e of r.headers){if(!e.includes(`: `))continue;let t=e.indexOf(`: `),r=e.substring(0,t).toLowerCase(),a=e.substring(t+2);r in i||(i[r]=[]),i[r].push(a)}return{headers:i,httpStatusCode:r.status}}async function streamToText(e){let t=e.pipeThrough(new TextDecoderStream).getReader(),r=[];for(;;){let{done:e,value:i}=await t.read();if(e)return r.join(``);i&&r.push(i)}}async function streamToBytes(e){let t=e.getReader(),r=[];for(;;){let{done:e,value:i}=await t.read();if(e){let e=r.reduce((e,t)=>e+t.byteLength,0),t=new Uint8Array(e),i=0;for(let e of r)t.set(e,i),i+=e.byteLength;return t}i&&r.push(i)}}var PHPResponse=class e{constructor(e,t,r,i=``,a=0){this.httpStatusCode=e,this.headers=t,this.bytes=r,this.exitCode=a,this.errors=i}static forHttpCode(t,r=``){return new e(t,{},new TextEncoder().encode(r||responseTexts[t]||``))}static fromRawData(t){return new e(t.httpStatusCode,t.headers,t.bytes,t.errors,t.exitCode)}static async fromStreamedResponse(t){return await t.finished,new e(await t.httpStatusCode,await t.headers,await t.stdoutBytes,await t.stderrText,await t.exitCode)}ok(){return this.httpStatusCode>=200&&this.httpStatusCode<400}toRawData(){return{headers:this.headers,bytes:this.bytes,errors:this.errors,exitCode:this.exitCode,httpStatusCode:this.httpStatusCode}}get json(){return JSON.parse(this.text)}get text(){return new TextDecoder().decode(this.bytes)}},_a,kError=Symbol(`error`),kMessage=Symbol(`message`),ErrorEvent2=class extends (_a=Event,_a){constructor(e,t={}){super(e),this[kError]=t.error===void 0?null:t.error,this[kMessage]=t.message===void 0?``:t.message}get error(){return this[kError]}get message(){return this[kMessage]}};Object.defineProperty(ErrorEvent2.prototype,"error",{enumerable:!0}),Object.defineProperty(ErrorEvent2.prototype,"message",{enumerable:!0});var ErrorEvent=typeof globalThis.ErrorEvent==`function`?globalThis.ErrorEvent:ErrorEvent2,UnhandledRejectionsTarget=class extends EventTarget{constructor(){super(...arguments),this.listenersCount=0}addEventListener(e,t,r){++this.listenersCount,super.addEventListener(e,t,r)}removeEventListener(e,t,r){--this.listenersCount,super.removeEventListener(e,t,r)}hasListeners(){return this.listenersCount>0}};function improveWASMErrorReporting(e){let t=new UnhandledRejectionsTarget;for(let r in e.wasmExports)if(typeof e.wasmExports[r]==`function`){let i=e.wasmExports[r];e.wasmExports[r]=function(...r){var a;try{return i(...r)}catch(r){if(!(r instanceof Error))throw r;e.lastAsyncifyStackSource&&(r.cause=e.lastAsyncifyStackSource);let i=clarifyErrorMessage(r,e.lastAsyncifyStackSource?.stack);if(t.hasListeners()){r.message=i;let e=new ErrorEvent(`error`,{error:r});throw t.dispatchEvent(e),r}throw isExitCode(r)&&r.status===0||showCriticalErrorBox(i),r}}}return t}var functionsMaybeMissingFromAsyncify=[];function getFunctionsMaybeMissingFromAsyncify(){return functionsMaybeMissingFromAsyncify}function clarifyErrorMessage(e,t){if(e.message===`unreachable`){let r=UNREACHABLE_ERROR;t||(r+=`

This stack trace is lacking. For a better one initialize 
the PHP runtime with debug: true, e.g. loadNodeRuntime('8.1', { emscriptenOptions: { debug: true } }).

`);let i=new Set(extractPHPFunctionsFromStack(t||``)),a=e;do{for(let e of extractPHPFunctionsFromStack(a.stack||``))i.add(e);a=a.cause}while(a);functionsMaybeMissingFromAsyncify=Array.from(i);for(let e of i)r+=`    * ${e}
`;return r+=`Original error message: ${e.message}
`,r}return e.message}var UNREACHABLE_ERROR=`
"unreachable" WASM instruction executed.

The typical reason is a PHP function missing from the ASYNCIFY_ONLY
list when building PHP.wasm.

You will need to file a new issue in the WordPress Playground repository
and paste this error message there:

https://github.com/WordPress/wordpress-playground/issues/new

If you're a core developer, the typical fix is to:

* Isolate a minimal reproduction of the error
* Add a reproduction of the error to php-asyncify.spec.ts in the WordPress Playground repository
* Run 'npm run fix-asyncify'
* Commit the changes, push to the repo, release updated NPM packages

Below is a list of all the PHP functions found in the stack trace to
help with the minimal reproduction. If they're all already listed in
the Dockerfile, you'll need to trigger this error again with long stack
traces enabled. In node.js, you can do it using the --stack-trace-limit=100
CLI option: 

`,redBg=`\x1B[41m`,bold=`\x1B[1m`,reset=`\x1B[0m`,eol=`\x1B[K`,logged=!1;function showCriticalErrorBox(e){if(!logged&&(logged=!0,!(e!=null&&e.trim().startsWith(`Program terminated with exit`)))){T$1.log(`${redBg}
${eol}
${bold}  WASM ERROR${reset}${redBg}`);for(let t of e.split(`
`))T$1.log(`${eol}  ${t} `);T$1.log(`${reset}`)}}function extractPHPFunctionsFromStack(e){try{let t=e.split(`
`).slice(1).map(e=>{let t=e.trim().substring(3).split(` `);return{fn:t.length>=2?t[0]:`<unknown>`,isWasm:e.includes(`wasm:/`)}}).filter(({fn:e,isWasm:t})=>t&&!e.startsWith(`dynCall_`)&&!e.startsWith(`invoke_`)).map(({fn:e})=>e);return Array.from(new Set(t))}catch{return[]}}var STRING=`string`,NUMBER=`number`,__private__dont__use=Symbol(`__private__dont__use`),PHPExecutionFailureError=class extends Error{constructor(e,t,r){super(e),this.response=t,this.source=r}},MountStillActiveError=class extends Error{constructor(e){super(`The filesystem could not be flushed and remains mounted.`,{cause:e}),this.name=`MountStillActiveError`}},PHP_INI_PATH=`/internal/shared/php.ini`,AUTO_PREPEND_SCRIPT=`/internal/shared/auto_prepend_file.php`,OPCACHE_FILE_FOLDER=`/internal/shared/opcache`,Q,z,G,j,J,W,K,ne,k,y,ye,Ee,xe,Se,ke,Fe,be,Re,He,ge,Te,Pe,we,PHP=class{constructor(e){_(this,y),_(this,Q),_(this,z,!1),_(this,G,null),_(this,j,new Map([[`*`,new Set]])),_(this,J,[]),_(this,W,{}),_(this,K),_(this,ne,new Map),_(this,k,{enabled:!1,recreateRuntime:()=>0,needsRotating:!1,maxRequests:400,requestsMade:0}),this.semaphore=new v$1({concurrency:1}),e!==void 0&&this.initializeRuntime(e),this.addEventListener(`request.error`,e=>{e.source===`php-wasm`&&(u(this,k).needsRotating=!0)})}addEventListener(e,t){u(this,j).has(e)||u(this,j).set(e,new Set),u(this,j).get(e).add(t)}removeEventListener(e,t){var r;(r=u(this,j).get(e))==null||r.delete(t)}dispatchEvent(e){let t=[...u(this,j).get(e.type)||[],...u(this,j).get(`*`)||[]];if(t.length===0)return;let r=A$1 in e&&e[A$1]===!0&&`stdin`in e&&typeof ReadableStream<`u`&&e.stdin instanceof ReadableStream;if(t.length>1&&r){let r=e.stdin;for(let i=0;i<t.length-1;i++){let[a,s]=r.tee();r=s,t[i]({...e,stdin:a})}t[t.length-1]({...e,stdin:r})}else for(let r of t)r(e)}onMessage(e){return u(this,J).push(e),async()=>{x(this,J,u(this,J).filter(t=>t!==e))}}async setSpawnHandler(handler){typeof handler==`string`&&(handler=S$1(eval(handler))),x(this,K,handler)}setCommandSpawnHandler(e,t){u(this,ne).set(e,t)}get absoluteUrl(){return this.requestHandler.absoluteUrl}get documentRoot(){return this.requestHandler.documentRoot}pathToInternalUrl(e){return this.requestHandler.pathToInternalUrl(e)}internalUrlToPath(e){return this.requestHandler.internalUrlToPath(e)}initializeRuntime(e){if(this[__private__dont__use])throw Error(`PHP runtime already initialized.`);let t=popLoadedRuntime(e);if(!t)throw Error(`Invalid PHP runtime id.`);if(this[__private__dont__use]=t,t.spawnProcess=(e,t,r)=>v(this,y,ye).call(this,e,t,r),this[__private__dont__use].ccall(`wasm_set_phpini_path`,null,[`string`],[PHP_INI_PATH]),!this.fileExists(PHP_INI_PATH)){let e=[`opcache.enable = 1`,`opcache.enable_cli = 1`,`opcache.jit = 0`,`opcache.interned_strings_buffer = 8`,`opcache.max_accelerated_files = 1000`,`opcache.memory_consumption = 64`,`opcache.max_wasted_percentage = 5`,`opcache.file_cache = `+OPCACHE_FILE_FOLDER,`opcache.file_cache_only = 1`,`opcache.file_cache_consistency_checks = 1`];this.fileExists(OPCACHE_FILE_FOLDER)||this.mkdir(OPCACHE_FILE_FOLDER),this.writeFile(PHP_INI_PATH,[`auto_prepend_file=`+AUTO_PREPEND_SCRIPT,`memory_limit=256M`,`ignore_repeated_errors = 1`,`error_reporting = E_ALL`,`display_errors = 1`,`html_errors = 1`,`display_startup_errors = On`,`log_errors = 1`,`always_populate_raw_post_data = -1`,`upload_max_filesize = 2000M`,`post_max_size = 2000M`,`allow_url_fopen = On`,`allow_url_include = Off`,`session.save_path = /home/web_user`,`implicit_flush = 1`,`output_buffering = 0`,`max_execution_time = 0`,`max_input_time = -1`,...e].join(`
`))}this.fileExists(AUTO_PREPEND_SCRIPT)||this.writeFile(AUTO_PREPEND_SCRIPT,`<?php
				// Define constants set via defineConstant() calls
				if(file_exists('/internal/shared/consts.json')) {
					$consts = json_decode(file_get_contents('/internal/shared/consts.json'), true);
					foreach ($consts as $const => $value) {
						if (!defined($const) && is_scalar($value)) {
							define($const, $value);
						}
					}
				}
				// Preload all the files from /internal/shared/preload
				foreach (glob('/internal/shared/preload/*.php') as $file) {
					require_once $file;
				}
				`),t.onMessage=async e=>{for(let t of u(this,J)){let r=await t(e);if(r)return r}return``},x(this,G,improveWASMErrorReporting(t)),this.dispatchEvent({type:`runtime.initialized`})}async setSapiName(e){if(this[__private__dont__use].ccall(`wasm_set_sapi_name`,NUMBER,[STRING],[e])!==0)throw Error(`Could not set SAPI name. This can only be done before the PHP WASM module is initialized.Did you already dispatch any requests?`);x(this,Q,e)}chdir(e){this[__private__dont__use].FS.chdir(e)}cwd(){return this[__private__dont__use].FS.cwd()}chmod(e,t){this[__private__dont__use].FS.chmod(e,t)}async request(e){if(T$1.debug(`PHP.request() is deprecated. Please use new PHPRequestHandler() instead.`),!this.requestHandler)throw Error(`No request handler available.`);return this.requestHandler.request(e)}async run(e){let t=await this.runStream(e),r=await PHPResponse.fromStreamedResponse(t);if(r.exitCode!==0)throw new PHPExecutionFailureError(`PHP.run() failed with exit code ${r.exitCode}. 

=== Stdout ===
 ${r.text}

=== Stderr ===
 ${r.errors}`,r,`request`);return r}async runStream(e){let t=await this.semaphore.acquire(),r,i=v(this,y,we).call(this,async()=>{if(u(this,z)||(await this[__private__dont__use].ccall(`php_wasm_init`,null,[],[],{isAsync:!0}),x(this,z,!0)),e.scriptPath&&!this.fileExists(e.scriptPath))throw Error(`The script path "${e.scriptPath}" does not exist.`);v(this,y,xe).call(this,e.relativeUri||``),v(this,y,be).call(this,e.method||`GET`);let t=normalizeHeaders(e.headers||{}),i=t.host||`example.com:443`,a=v(this,y,Fe).call(this,i,e.protocol||`http`);if(v(this,y,Se).call(this,i),v(this,y,ke).call(this,a),v(this,y,Re).call(this,t),e.body&&(r=v(this,y,He).call(this,e.body)),typeof e.code==`string`)this.writeFile(`/internal/eval.php`,e.code),v(this,y,ge).call(this,`/internal/eval.php`);else if(typeof e.scriptPath==`string`)v(this,y,ge).call(this,e.scriptPath||``);else throw TypeError("The request object must have either a `code` or a `scriptPath` property.");let s=v(this,y,Ee).call(this,e.$_SERVER,t,a);for(let e in s)v(this,y,Te).call(this,e,s[e]);let O=e.env||{};for(let e in O)v(this,y,Pe).call(this,e,O[e]);return await this[__private__dont__use].ccall(`wasm_sapi_handle_request`,NUMBER,[],[],{async:!0})}),a=()=>{if(r)try{this[__private__dont__use].free(r)}catch(e){T$1.error(e)}t(),this.dispatchEvent({type:`request.end`})};return i.then(e=>(e.finished.finally(a),e),e=>{try{a()}catch{}finally{throw e}})}defineConstant(e,t){let r={};try{r=JSON.parse(this.fileExists(`/internal/shared/consts.json`)&&this.readFileAsText(`/internal/shared/consts.json`)||`{}`)}catch{}this.writeFile(`/internal/shared/consts.json`,JSON.stringify({...r,[e]:t}))}mkdir(e){let t=FSHelpers.mkdir(this[__private__dont__use].FS,e);return this.dispatchEvent({type:`filesystem.write`}),t}mkdirTree(e){return FSHelpers.mkdir(this[__private__dont__use].FS,e)}readFileAsText(e){return FSHelpers.readFileAsText(this[__private__dont__use].FS,e)}readFileAsBuffer(e){return FSHelpers.readFileAsBuffer(this[__private__dont__use].FS,e)}writeFile(e,t){let r=FSHelpers.writeFile(this[__private__dont__use].FS,e,t);return this.dispatchEvent({type:`filesystem.write`}),r}unlink(e){let t=FSHelpers.unlink(this[__private__dont__use].FS,e);return this.dispatchEvent({type:`filesystem.write`}),t}mv(e,t){let r=FSHelpers.mv(this[__private__dont__use].FS,e,t);return this.dispatchEvent({type:`filesystem.write`}),r}cp(e,t){let r=FSHelpers.copyRecursive(this[__private__dont__use].FS,e,t);return this.dispatchEvent({type:`filesystem.write`}),r}rmdir(e,t={recursive:!0}){let r=FSHelpers.rmdir(this[__private__dont__use].FS,e,t);return this.dispatchEvent({type:`filesystem.write`}),r}listFiles(e,t={prependPath:!1}){return FSHelpers.listFiles(this[__private__dont__use].FS,e,t)}isDir(e){return FSHelpers.isDir(this[__private__dont__use].FS,e)}isFile(e){return FSHelpers.isFile(this[__private__dont__use].FS,e)}symlink(e,t){return FSHelpers.symlink(this[__private__dont__use].FS,e,t)}isSymlink(e){return FSHelpers.isSymlink(this[__private__dont__use].FS,e)}readlink(e){return FSHelpers.readlink(this[__private__dont__use].FS,e)}realpath(e){return FSHelpers.realpath(this[__private__dont__use].FS,e)}fileExists(e){return FSHelpers.fileExists(this[__private__dont__use].FS,e)}enableRuntimeRotation(e){x(this,k,{...u(this,k),enabled:!0,recreateRuntime:e.recreateRuntime,maxRequests:e.maxRequests??400})}async rotateRuntime(){if(!u(this,k).enabled)throw Error(`Runtime rotation is not enabled. Call enableRuntimeRotation() first.`);await this.hotSwapPHPRuntime(await u(this,k).recreateRuntime()),u(this,k).requestsMade=0,u(this,k).needsRotating=!1}async hotSwapPHPRuntime(e){let t=this[__private__dont__use].FS,r=this.listFiles(`/`).map(e=>`/${e}`),i=t.cwd();t.chdir(`/`);let a=Object.entries(u(this,W)).map(([e,r])=>({mountHandler:r.mountHandler,mountPointSnapshot:snapshotMountPoint(t,e),vfsPath:e})),s=Object.values(u(this,W)).reverse();for(let e of s)await e.unmount();try{this.exit()}catch{}this.initializeRuntime(e),u(this,Q)&&this.setSapiName(u(this,Q));let O=this[__private__dont__use].FS;for(let e of r)e&&e!==`/request`&&copyMEMFSNodes(t,O,e);for(let{mountHandler:e,mountPointSnapshot:t,vfsPath:r}of a)try{await this.mount(r,e)}catch(i){if(isMissingMountSourceError(i)){restoreMountPointSnapshot(O,r,t);continue}if(!isMissingMountTargetPathError(i))throw i;this.mkdir(r),await this.mount(r,e)}try{O.chdir(i)}catch(e){throw Error(`Failed to restore CWD to ${i} after PHP runtime rotation.`,{cause:e})}}async mount(e,t){let r=await t(this,this[__private__dont__use].FS,e),i={mountHandler:t,unmount:async()=>{try{await r()}catch(t){throw t instanceof MountStillActiveError||delete u(this,W)[e],t}delete u(this,W)[e]}};return u(this,W)[e]=i,async()=>{let r=u(this,W)[e];r?.mountHandler===t&&await r.unmount()}}async cli(e,t={}){if(j$1(e[0]??``)!==`php`)return this.subProcess(e,t);u(this,z)&&(u(this,k).needsRotating=!0);let r=await this.semaphore.acquire();return await v(this,y,we).call(this,()=>{let r=t.env||{};for(let[e,t]of Object.entries(r))v(this,y,Pe).call(this,e,t);e=[e[0],`-c`,PHP_INI_PATH,...e.slice(1)];for(let t of e)this[__private__dont__use].ccall(`wasm_add_cli_arg`,null,[STRING],[t]);return this[__private__dont__use].ccall(`run_cli`,null,[],[],{async:!0})}).then(e=>(e.exitCode.finally(r),e)).finally(()=>{u(this,k).needsRotating=!0})}async subProcess(e,t={}){let r=v(this,y,ye).call(this,e[0],e.slice(1),{env:t.env,cwd:t.cwd??this.cwd()}),i=await createInvertedReadableStream();r.on(`error`,e=>{safeStreamError$1(i.controller,e)});let a=e=>{try{i.controller.enqueue(e)}catch{r.stderr.off(`data`,a)}};r.stderr.on(`data`,a);let s=await createInvertedReadableStream(),O=e=>{try{s.controller.enqueue(e)}catch{r.stdout.off(`data`,O)}};return r.stdout.on(`data`,O),r.on(`exit`,()=>{setTimeout(()=>{try{i.controller.close()}catch{}try{s.controller.close()}catch{}},0)}),new StreamedPHPResponse(new ReadableStream({start(e){e.close()}}),s.stream,i.stream,new Promise(e=>{r.on(`exit`,t=>{e(t)})}))}setSkipShebang(e){this[__private__dont__use].ccall(`wasm_set_skip_shebang`,null,[NUMBER],[+!!e])}exit(e=0){this.dispatchEvent({type:`runtime.beforeExit`});try{this[__private__dont__use]._exit(e)}catch{}x(this,z,!1),x(this,G,null),this[__private__dont__use]&&(delete this[__private__dont__use].onMessage,delete this[__private__dont__use])}[Symbol.dispose](){this.exit(0)}};Q=new WeakMap,z=new WeakMap,G=new WeakMap,j=new WeakMap,J=new WeakMap,W=new WeakMap,K=new WeakMap,ne=new WeakMap,k=new WeakMap,y=new WeakSet,ye=function(e,t=[],r={}){let i=Array.isArray(e)?e:t.length?[e,...t]:x$1(e),a=i[0]&&u(this,ne).get(j$1(i[0]));if(a)return a(i[0],i.slice(1),r);if(u(this,K))return u(this,K).call(this,e,t,r);let s=Error(`popen(), proc_open() are unsupported on this PHP instance. Call php.setSpawnHandler()
			and provide a callback to handle spawning processes, or disable popen(), proc_open() via php.ini.`);throw s.code=`SPAWN_UNSUPPORTED`,s},Ee=function(e,t,r){let i={...e||{}};i.HTTPS=i.HTTPS||r===443?`on`:`off`;for(let e in t){let r=`HTTP_`;[`content-type`,`content-length`].includes(e.toLowerCase())&&(r=``),i[`${r}${e.toUpperCase().replace(/-/g,`_`)}`]=t[e]}return i},xe=function(e){this[__private__dont__use].ccall(`wasm_set_request_uri`,null,[STRING],[e]);let t=``;e.includes(`?`)&&(t=e.substring(e.indexOf(`?`)+1)),this[__private__dont__use].ccall(`wasm_set_query_string`,null,[STRING],[t])},Se=function(e){this[__private__dont__use].ccall(`wasm_set_request_host`,null,[STRING],[e])},ke=function(e){this[__private__dont__use].ccall(`wasm_set_request_port`,null,[NUMBER],[e])},Fe=function(e,t){let r;try{r=parseInt(new URL(e).port,10)}catch{}return(!r||isNaN(r)||r===80)&&(r=t===`https`?443:80),r},be=function(e){this[__private__dont__use].ccall(`wasm_set_request_method`,null,[STRING],[e])},Re=function(e){e.cookie&&this[__private__dont__use].ccall(`wasm_set_cookies`,null,[STRING],[e.cookie]),e[`content-type`]&&this[__private__dont__use].ccall(`wasm_set_content_type`,null,[STRING],[e[`content-type`]]),e[`content-length`]&&this[__private__dont__use].ccall(`wasm_set_content_length`,null,[NUMBER],[parseInt(e[`content-length`],10)])},He=function(e){let t,r;typeof e==`string`?(T$1.warn(`Passing a string as the request body is deprecated. Please use a Uint8Array instead. See https://github.com/WordPress/wordpress-playground/issues/997 for more details`),r=this[__private__dont__use].lengthBytesUTF8(e),t=r+1):(r=e.byteLength,t=e.byteLength);let i=this[__private__dont__use].malloc(t);if(!i)throw Error(`Could not allocate memory for the request body.`);return typeof e==`string`?this[__private__dont__use].stringToUTF8(e,i,t+1):this[__private__dont__use].HEAPU8.set(e,i),this[__private__dont__use].ccall(`wasm_set_request_body`,null,[NUMBER],[i]),this[__private__dont__use].ccall(`wasm_set_content_length`,null,[NUMBER],[r]),i},ge=function(e){this[__private__dont__use].ccall(`wasm_set_path_translated`,null,[STRING],[e])},Te=function(e,t){this[__private__dont__use].ccall(`wasm_add_SERVER_entry`,null,[STRING,STRING],[e,t])},Pe=function(e,t){this[__private__dont__use].ccall(`wasm_add_ENV_entry`,null,[STRING,STRING],[e,t])},we=async function(e){u(this,k).enabled&&u(this,k).needsRotating&&await this.rotateRuntime(),++u(this,k).requestsMade,u(this,k).requestsMade>=u(this,k).maxRequests&&(u(this,k).needsRotating=!0);let t=this[__private__dont__use],r=await createInvertedReadableStream();t.onHeaders=e=>{N||i||r.controller.enqueue(e.slice())};let i=!1,a=()=>{i||(i=!0,r.controller.close())},s=await createInvertedReadableStream();t.onStdout=e=>{a(),!N&&s.controller.enqueue(e.slice())};let O=await createInvertedReadableStream();t.onStderr=e=>{N||O.controller.enqueue(e.slice())};let N=!1,F,L=(async()=>{var t;try{return await Promise.race([e(),new Promise((e,t)=>{var r;F=e=>{isExitCode(e.error)||t(e.error)},(r=u(this,G))==null||r.addEventListener(`error`,F,{once:!0})})])}catch(e){if(isExitCode(e))return e.status;safeStreamError$1(s.controller,e),safeStreamError$1(O.controller,e),safeStreamError$1(r.controller,e),N=!0;for(let e in this)typeof this[e]==`function`&&(this[e]=()=>{throw Error(`PHP runtime has crashed – see the earlier error for details.`)});throw this.functionsMaybeMissingFromAsyncify=getFunctionsMaybeMissingFromAsyncify(),e}finally{N||=(safeStreamClose$1(s.controller),safeStreamClose$1(O.controller),a(),!0),(t=u(this,G))==null||t.removeEventListener(`error`,F)}})().then(e=>(e!==0&&this.dispatchEvent({type:`request.error`,error:Error(`PHP.run() failed with exit code ${e}.`),source:`php-wasm`}),e),e=>{let t=e.source??`php-wasm`;throw this.dispatchEvent({type:`request.error`,error:e,source:t}),e});return new StreamedPHPResponse(r.stream,s.stream,O.stream,L)};function normalizeHeaders(e){let t={};for(let r in e)t[r.toLowerCase()]=e[r];return t}function copyMEMFSNodes(e,t,r){if(getNodeType(e,r)!==`memfs`||![`memfs`,`missing`].includes(getNodeType(t,r)))return;let i=e.lookupPath(r,{follow:!1});if(e.isLink(i.node.mode)){let i=e.readlink(r);t.symlink(i,r);return}if(!e.isDir(i.node.mode)){t.writeFile(r,e.readFile(r));return}t.mkdirTree(r);let a=e.readdir(r).filter(e=>e!==`.`&&e!==`..`);for(let i of a)copyMEMFSNodes(e,t,m(r,i))}function snapshotMountPoint(e,t){try{let r=e.lookupPath(t,{follow:!1});return e.isLink(r.node.mode)?{kind:`symlink`,target:e.readlink(t)}:e.isDir(r.node.mode)?{kind:`directory`}:{kind:`file`}}catch{return}}function restoreMountPointSnapshot(e,t,r){if(r&&getNodeType(e,t)===`missing`){if(r.kind===`directory`){e.mkdirTree(t);return}e.mkdirTree(W$1(t)),r.kind===`symlink`?e.symlink(r.target,t):e.writeFile(t,new Uint8Array)}}function isMissingMountSourceError(e){return e.phpWasmMountSourceMissing===!0}function isMissingMountTargetPathError(e){return e.errno===44}async function createInvertedReadableStream(e={}){let t,r=new Promise(e=>{t=e});return{stream:new ReadableStream({...e,start(r){if(t(r),e.start)return e.start(r)}}),controller:await r}}function safeStreamError$1(e,t){try{e.error(t)}catch{}}function safeStreamClose$1(e){try{e.close()}catch{}}var getNodeType=(e,t)=>{try{return`contents`in e.lookupPath(t,{follow:!0}).node?`memfs`:`not-memfs`}catch{return`missing`}};async function getPhpIniEntries(e,t,r=PHP_INI_PATH){let i=(0,import_ini.parse)(await e.readFileAsText(r));if(t===void 0)return i;let a={};for(let e of t)a[e]=i[e];return a}async function setPhpIniEntries(e,t,r=PHP_INI_PATH){let i=(0,import_ini.parse)(await e.readFileAsText(r));for(let[e,r]of Object.entries(t))r==null?delete i[e]:i[e]=r;await e.writeFile(r,(0,import_ini.stringify)(i))}async function withPHPIniValues(e,t,r){let i=await e.readFileAsText(PHP_INI_PATH);try{return await setPhpIniEntries(e,t),await r()}finally{await e.writeFile(PHP_INI_PATH,i)}}async function printDebugDetails(e,t){t&&printResponseDebugDetails(await PHPResponse.fromStreamedResponse(t)),await prettyPrintFullStackTrace(e)}async function prettyPrintFullStackTrace(e){let t=e,r=!0;for(;t;)r||process.stderr.write(`
Caused by:

`),process.stderr.write(t.originalErrorClassName??t.name),process.stderr.write(`: `+t.message+`
`),process.stderr.write((t.stack+``).split(`
`).slice(1).join(`
`)),process.stderr.write(`
`),t.response&&printResponseDebugDetails(t.response),t.phpLogs&&(process.stderr.write(`

==== PHP error log ====

`),process.stderr.write(t.phpLogs)),t=t.cause,r=!1;process.stderr.write(`
`)}function describeError(e,t=new WeakSet,r=0,i={}){return r>10?`[Max error cause depth exceeded]`:e instanceof Error?e.message?e.message:describeErrorObject(e,t,r,{...i,suppressGenericErrorName:!0}):e&&typeof e==`object`?describeErrorObject(e,t,r,i):String(e)}function describeErrorObject(e,t,r,i={}){if(t.has(e))return`[Circular error cause]`;t.add(e);let a=[];if(e.name&&!(i.suppressGenericErrorName&&e.name===`Error`)&&a.push(String(e.name)),e.message&&a.push(String(e.message)),e.errno!==void 0&&a.push(`errno: ${e.errno}`),e.code!==void 0&&a.push(`code: ${e.code}`),e.cause&&a.push(`caused by: ${describeError(e.cause,t,r+1,i)}`),a.length>0)return a.join(` — `);if(typeof e.stack==`string`)return e.stack;try{return JSON.stringify(e)}catch{return String(e)}}function printResponseDebugDetails(e){process.stderr.write(`
    exitCode=${e.exitCode} httpStatusCode=${e.httpStatusCode} `);let t=e.headers&&Object.keys(e.headers).length>0;t||process.stderr.write(`responseHeaders=(empty) `),e.text||process.stderr.write(`stdout=(empty) `),e.errors||process.stderr.write(`stderr=(empty) `),process.stderr.write(`
`),t&&process.stderr.write(`
==== PHP response headers ====

${JSON.stringify(e.headers,null,2)}

`),e.text&&(process.stderr.write(`
==== PHP stdout ====

`),process.stderr.write(e.text)),e.errors&&(process.stderr.write(`
==== PHP stderr ====

`),process.stderr.write(e.errors)),process.stderr.write(`
`)}var HttpCookieStore=class{constructor(){this.cookies={}}rememberCookiesFromResponseHeaders(e){if(e!=null&&e[`set-cookie`])for(let t of e[`set-cookie`])try{if(!t.includes(`=`))continue;let e=t.indexOf(`=`),r=t.substring(0,e),i=t.substring(e+1).split(`;`)[0];this.cookies[r]=i}catch(e){T$1.error(e)}}getCookieRequestHeader(){let e=[];for(let t in this.cookies)e.push(`${t}=${this.cookies[t]}`);return e.join(`; `)}};function streamReadFileFromPHP(e,t){return new ReadableStream({async pull(r){let i=await e.readFileAsBuffer(t);r.enqueue(i),r.close()}})}async function*iteratePhpFiles(e,t,{relativePaths:r=!0,pathPrefix:i,exceptPaths:a=[]}={}){t=c$1(t);let s=[t];for(;s.length;){let O=s.pop();if(!O)return;let N=await e.listFiles(O);for(let F of N){let N=`${O}/${F}`;a.includes(N.substring(t.length+1))||(await e.isDir(N)?s.push(N):yield new E(streamReadFileFromPHP(e,N),r?m(i||``,N.substring(t.length+1)):N))}}}function writeFilesStreamToPhp(e,t){return new WritableStream({async write(r){let i=m(t,r.name);r.type===`directory`?await e.mkdir(i):(await e.mkdir(W$1(i)),await e.writeFile(i,new Uint8Array(await r.arrayBuffer())))}})}var SinglePHPInstanceManager=class{constructor(e){if(this.isAcquired=!1,!e.php&&!e.phpFactory)throw Error(`SinglePHPInstanceManager requires either php or phpFactory`);this.php=e.php,this.phpFactory=e.phpFactory}async getPrimaryPhp(){return this.php?this.php:(this.phpPromise||=this.phpFactory().then(e=>(this.php=e,this.phpPromise=void 0,e)),this.phpPromise)}async acquirePHPInstance(){if(this.isAcquired)throw Error(`The PHP instance already acquired. SinglePHPInstanceManager cannot spawn another PHP instance since, by definition, it only manages a single PHP instance.`);let e=await this.getPrimaryPhp();return this.isAcquired=!0,{php:e,reap:()=>{this.isAcquired=!1}}}async[Symbol.asyncDispose](){this.php&&this.php.exit()}},MaxPhpInstancesError=class extends Error{constructor(e){super(`Requested more concurrent PHP instances than the limit (${e}).`),this.name=this.constructor.name}},PHPProcessManager=class{constructor(e){this.instances=[],this.idleInstances=[],this.maxPhpInstances=e?.maxPhpInstances??2,this.phpFactory=e?.phpFactory,this.semaphore=new v$1({concurrency:this.maxPhpInstances,timeout:e?.timeout||3e4})}async getPrimaryPhp(){if(this.instances.length>0)return this.instances[0];this.primaryPhpPromise||=this.spawnInstance(!0);try{return await this.primaryPhpPromise}finally{this.primaryPhpPromise=void 0}}async acquirePHPInstance(){let e;try{e=await this.semaphore.acquire()}catch(e){throw e instanceof b?new MaxPhpInstancesError(this.maxPhpInstances):e}let t=await this.getOrSpawnInstance();return{php:t,reap:()=>{this.idleInstances.push(t),e()}}}async getOrSpawnInstance(){return this.instances.length===0&&await this.getPrimaryPhp(),this.idleInstances.length===0&&await this.spawnInstance(!1),this.idleInstances.pop()}async spawnInstance(e){if(!this.phpFactory)throw Error(`phpFactory must be set before spawning instances.`);let t=await this.phpFactory({isPrimary:e});return this.instances.push(t),this.idleInstances.push(t),t}async[Symbol.asyncDispose](){for(let e of this.instances)e.exit();this.instances=[],this.idleInstances=[]}},PHPNextVersion=`next`,SupportedPHPVersions=[`8.5`,`8.4`,`8.3`,`8.2`,`8.1`,`8.0`,`7.4`],LatestSupportedPHPVersion=SupportedPHPVersions[0],SupportedPHPVersionsList=SupportedPHPVersions,LegacyPHPVersions=[`5.2`];function isPHPNextVersion(e){return e===PHPNextVersion}function isLegacyPHPVersion(e){return LegacyPHPVersions.includes(e??``)}var AllPHPVersions=[PHPNextVersion,...SupportedPHPVersions,...LegacyPHPVersions],LEGACY_PHP_INI_PATH=`/internal/shared/php.ini`,LEGACY_PHP_INI_CONTENT=`auto_prepend_file=/internal/shared/auto_prepend_file.php
memory_limit=256M
ignore_repeated_errors = 1
error_reporting = E_ALL
display_errors = 1
html_errors = 1
display_startup_errors = On
log_errors = 1
always_populate_raw_post_data = -1
upload_max_filesize = 2000M
post_max_size = 2000M
allow_url_fopen = On
allow_url_include = Off
session.save_path = /home/web_user
implicit_flush = 1
output_buffering = 0
max_execution_time = 0
max_input_time = -1
disable_functions = ini_get_all
opcache.enable = 0
opcache.enable_cli = 0`;function createLegacyPhpIniPreRunStep(){return e=>{e.FS.mkdirTree(`/internal/shared`),e.FS.writeFile(LEGACY_PHP_INI_PATH,LEGACY_PHP_INI_CONTENT)}}var DEFAULT_BASE_URL=`http://example.com`;function toRelativeUrl(e){return e.origin===`null`?e.toString():e.toString().substring(e.origin.length)}function removePathPrefix(e,t){return!t||!e.startsWith(t)?e:e.substring(t.length)}function ensurePathPrefix(e,t){return!t||e.startsWith(t)?e:t+e}async function encodeAsMultipart(e){let t=`----${Math.random().toString(36).slice(2)}`,r=`multipart/form-data; boundary=${t}`,i=new TextEncoder,a=[];for(let[r,i]of Object.entries(e))a.push(`--${t}\r
`),a.push(`Content-Disposition: form-data; name="${r}"`),i instanceof File&&a.push(`; filename="${i.name}"`),a.push(`\r
`),i instanceof File&&(a.push(`Content-Type: application/octet-stream`),a.push(`\r
`)),a.push(`\r
`),i instanceof File?a.push(await fileToUint8Array(i)):a.push(i),a.push(`\r
`);a.push(`--${t}--\r
`);let s=a.reduce((e,t)=>e+t.length,0),O=new Uint8Array(s),N=0;for(let e of a)O.set(typeof e==`string`?i.encode(e):e,N),N+=e.length;return{bytes:O,contentType:r}}function fileToUint8Array(e){return e.arrayBuffer().then(e=>new Uint8Array(e))}var _default=`application/octet-stream`,asx=`video/x-ms-asf`,atom=`application/atom+xml`,avi=`video/x-msvideo`,avif=`image/avif`,bin=`application/octet-stream`,bmp=`image/x-ms-bmp`,cco=`application/x-cocoa`,cjs=`application/javascript`,css=`text/css`,data=`application/octet-stream`,deb=`application/octet-stream`,der=`application/x-x509-ca-cert`,dmg=`application/octet-stream`,doc=`application/msword`,docx=`application/vnd.openxmlformats-officedocument.wordprocessingml.document`,eot=`application/vnd.ms-fontobject`,flv=`video/x-flv`,gif=`image/gif`,gz=`application/gzip`,hqx=`application/mac-binhex40`,htc=`text/x-component`,html=`text/html`,ico=`image/x-icon`,iso=`application/octet-stream`,jad=`text/vnd.sun.j2me.app-descriptor`,jar=`application/java-archive`,jardiff=`application/x-java-archive-diff`,jng=`image/x-jng`,jnlp=`application/x-java-jnlp-file`,jpg=`image/jpeg`,jpeg=`image/jpeg`,js=`application/javascript`,json=`application/json`,kml=`application/vnd.google-earth.kml+xml`,kmz=`application/vnd.google-earth.kmz`,m3u8=`application/vnd.apple.mpegurl`,m4a=`audio/x-m4a`,m4v=`video/x-m4v`,md=`text/plain`,mid=`audio/midi`,mjs=`application/javascript`,mml=`text/mathml`,mng=`video/x-mng`,mov=`video/quicktime`,mp3=`audio/mpeg`,mp4=`video/mp4`,mpeg=`video/mpeg`,msi=`application/octet-stream`,odg=`application/vnd.oasis.opendocument.graphics`,odp=`application/vnd.oasis.opendocument.presentation`,ods=`application/vnd.oasis.opendocument.spreadsheet`,odt=`application/vnd.oasis.opendocument.text`,ogg=`audio/ogg`,otf=`font/otf`,pdf=`application/pdf`,pl=`application/x-perl`,png=`image/png`,ppt=`application/vnd.ms-powerpoint`,pptx=`application/vnd.openxmlformats-officedocument.presentationml.presentation`,prc=`application/x-pilot`,ps=`application/postscript`,ra=`audio/x-realaudio`,rar=`application/x-rar-compressed`,rpm=`application/x-redhat-package-manager`,rss=`application/rss+xml`,rtf=`application/rtf`,run=`application/x-makeself`,sea=`application/x-sea`,sit=`application/x-stuffit`,svg=`image/svg+xml`,swf=`application/x-shockwave-flash`,tcl=`application/x-tcl`,tar=`application/x-tar`,tif=`image/tiff`,ts=`video/mp2t`,ttf=`font/ttf`,txt=`text/plain`,wasm=`application/wasm`,wbmp=`image/vnd.wap.wbmp`,webm=`video/webm`,webp=`image/webp`,wml=`text/vnd.wap.wml`,wmlc=`application/vnd.wap.wmlc`,wmv=`video/x-ms-wmv`,woff=`font/woff`,woff2=`font/woff2`,xhtml=`application/xhtml+xml`,xls=`application/vnd.ms-excel`,xlsx=`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,xml=`text/xml`,xpi=`application/x-xpinstall`,xspf=`application/xspf+xml`,zip=`application/zip`,mimeTypes={_default,"3gpp":`video/3gpp`,"7z":`application/x-7z-compressed`,asx,atom,avi,avif,bin,bmp,cco,cjs,css,data,deb,der,dmg,doc,docx,eot,flv,gif,gz,hqx,htc,html,ico,iso,jad,jar,jardiff,jng,jnlp,jpg,jpeg,js,json,kml,kmz,m3u8,m4a,m4v,md,mid,mjs,mml,mng,mov,mp3,mp4,mpeg,msi,odg,odp,ods,odt,ogg,otf,pdf,pl,png,ppt,pptx,prc,ps,ra,rar,rpm,rss,rtf,run,sea,sit,svg,swf,tcl,tar,tif,ts,ttf,txt,wasm,wbmp,webm,webp,wml,wmlc,wmv,woff,woff2,xhtml,xls,xlsx,xml,xpi,xspf,zip},C,Z,ie,X,ee,I,te,V,oe,R,Me,le,Le,Ie,Ae,PHPRequestHandler=class{constructor(e){_(this,R),_(this,C),_(this,Z),_(this,ie),_(this,X),_(this,ee),_(this,I),_(this,te),_(this,V),_(this,oe);let{documentRoot:t=`/www/`,absoluteUrl:r=typeof location==`object`?location.href:DEFAULT_BASE_URL,rewriteRules:i=[],pathAliases:a=[],getFileNotFoundAction:s=()=>({type:`404`})}=e,O=e=>{e.isDir(t)||e.mkdir(t),e.chdir(t),e.requestHandler=this};if(e.php)O(e.php),this.instanceManager=new SinglePHPInstanceManager({php:e.php});else if(e.phpFactory)this.instanceManager=new PHPProcessManager({phpFactory:async t=>{let r=await e.phpFactory({...t,requestHandler:this});return O(r),r},maxPhpInstances:e.maxPhpInstances});else throw Error(`Either php or phpFactory must be provided in the configuration.`);x(this,V,e.cookieStore===void 0?new HttpCookieStore:e.cookieStore),x(this,C,t);let N=new URL(r);x(this,ie,N.hostname),x(this,X,N.port?Number(N.port):N.protocol===`https:`?443:80),x(this,Z,(N.protocol||``).replace(`:`,``));let F=u(this,X)!==443&&u(this,X)!==80;x(this,ee,[u(this,ie),F?`:${u(this,X)}`:``].join(``)),x(this,I,N.pathname.replace(/\/+$/,``)),x(this,te,[`${u(this,Z)}://`,u(this,ee),u(this,I)].join(``)),this.rewriteRules=i,x(this,oe,a),this.getFileNotFoundAction=s}async getPrimaryPhp(){return await this.instanceManager.getPrimaryPhp()}pathToInternalUrl(e){return e.startsWith(`/`)||(e=`/${e}`),`${this.absoluteUrl}${e}`}internalUrlToPath(e){let t=new URL(e,`https://playground.internal`);return t.pathname.startsWith(u(this,I))&&(t.pathname=t.pathname.slice(u(this,I).length)),toRelativeUrl(t)}get absoluteUrl(){return u(this,te)}get documentRoot(){return u(this,C)}async request(e){let t=await this.requestStreamed(e),r=await PHPResponse.fromStreamedResponse(t);return r.ok()&&r.exitCode!==0?new PHPResponse(500,r.headers,r.bytes,r.errors,r.exitCode):r}async requestStreamed(e){let t=looksLikeAbsoluteUrl(e.url),r=new URL(e.url.split(`#`)[0],t?void 0:DEFAULT_BASE_URL),i=v(this,R,Me).call(this,r),a=await this.getPrimaryPhp(),s=removePathPrefix(decodeURIComponent(i.pathname),u(this,I)),O=v(this,R,le).call(this,s);if(a.isDir(O)){if(!s.endsWith(`/`))return StreamedPHPResponse.fromPHPResponse(new PHPResponse(301,{location:[`${i.pathname}/`]},new Uint8Array));for(let e of[`index.php`,`index.html`]){let t=m(O,e);if(a.isFile(t)){O=t,i.pathname=m(i.pathname,e);break}}}if(!a.isFile(O)){let e=s;for(;e.startsWith(`/`)&&e!==W$1(e);){e=W$1(e);let t=v(this,R,le).call(this,e);if(a.isFile(t)&&t.endsWith(`.php`)){O=v(this,R,le).call(this,e);break}}}if(!a.isFile(O)){let e=this.getFileNotFoundAction(i.pathname);switch(e.type){case`response`:return StreamedPHPResponse.fromPHPResponse(e.response);case`internal-redirect`:O=m(u(this,C),e.uri);break;case`404`:return StreamedPHPResponse.forHttpCode(404);default:throw Error(`Unsupported file-not-found action type: '${e.type}'`)}}return a.isFile(O)?O.endsWith(`.php`)?await v(this,R,Ie).call(this,e,r,i,O):StreamedPHPResponse.fromPHPResponse(v(this,R,Le).call(this,a,O)):StreamedPHPResponse.forHttpCode(404)}prepare_$_SERVER_superglobal(e,t,r){let i={REMOTE_ADDR:`127.0.0.1`,DOCUMENT_ROOT:u(this,C),HTTPS:u(this,te).startsWith(`https://`)?`on`:``};return i.REQUEST_URI=e.pathname+e.search,r.startsWith(u(this,C))&&(i.SCRIPT_NAME=r.substring(u(this,C).length),i.PHP_SELF=t.pathname,i.REQUEST_URI.startsWith(i.SCRIPT_NAME)&&(i.PATH_INFO=i.REQUEST_URI.substring(i.SCRIPT_NAME.length),i.PATH_INFO.includes(`?`)&&(i.PATH_INFO=i.PATH_INFO.substring(0,i.PATH_INFO.indexOf(`?`))))),i.QUERY_STRING=t.search.substring(1),i}async[Symbol.asyncDispose](){await this.instanceManager[Symbol.asyncDispose]()}};C=new WeakMap,Z=new WeakMap,ie=new WeakMap,X=new WeakMap,ee=new WeakMap,I=new WeakMap,te=new WeakMap,V=new WeakMap,oe=new WeakMap,R=new WeakSet,Me=function(e){let t=applyRewriteRules(removePathPrefix(decodeURIComponent(e.pathname),u(this,I)),this.rewriteRules),r=new URL(m(u(this,I),t),e.toString());for(let[t,i]of e.searchParams.entries())r.searchParams.append(t,i);return r},le=function(e){for(let t of u(this,oe))if(e===t.urlPrefix||e.startsWith(t.urlPrefix+`/`)){let r=e.slice(t.urlPrefix.length);return m(t.fsPath,r)}return m(u(this,C),e)},Le=function(e,t){let r=e.readFileAsBuffer(t);return new PHPResponse(200,{"content-length":[`${r.byteLength}`],"content-type":[inferMimeType(t)],"accept-ranges":[`bytes`],"cache-control":[`public, max-age=0`]},r)},Ie=async function(e,t,r,i){let a;try{a=await this.instanceManager.acquirePHPInstance()}catch(e){return e instanceof MaxPhpInstancesError?StreamedPHPResponse.forHttpCode(502):StreamedPHPResponse.forHttpCode(500)}let s;try{s=await v(this,R,Ae).call(this,a.php,e,t,r,i)}catch(e){throw a.reap(),e}return s.finished.finally(()=>{a?.reap()}),s},Ae=async function(e,t,r,i,a){let s=`GET`,O={host:u(this,ee),...normalizeHeaders(t.headers||{})};u(this,V)&&(O.cookie=u(this,V).getCookieRequestHeader());let N=t.body;if(typeof N==`object`&&!(N instanceof Uint8Array)){s=`POST`;let{bytes:e,contentType:t}=await encodeAsMultipart(N);N=e,O[`content-type`]=t}let F=await e.runStream({relativeUri:ensurePathPrefix(toRelativeUrl(new URL(i.toString())),u(this,I)),protocol:u(this,Z),method:t.method||s,$_SERVER:this.prepare_$_SERVER_superglobal(r,i,a),body:N,scriptPath:a,headers:O});if(u(this,V)){let e=await F.headers;u(this,V).rememberCookiesFromResponseHeaders(e)}return F};function inferMimeType(e){return mimeTypes[e.split(`.`).pop()]||mimeTypes._default}function applyRewriteRules(e,t){for(let r of t)if(new RegExp(r.match).test(e)){e=e.replace(r.match,r.replacement);break}return e}function looksLikeAbsoluteUrl(e){try{return new URL(e),!0}catch{return!1}}function rotatePHPRuntime({php:e,recreateRuntime:t,maxRequests:r=400}){return e.enableRuntimeRotation({recreateRuntime:t,maxRequests:r})}async function writeFiles(e,t,r,{rmRoot:i=!1}={}){let a=resolveFileTree(t,r);i&&await e.isDir(t)&&await e.rmdir(t,{recursive:!0});for(let[t,r]of a)await e.fileExists(W$1(t))||await e.mkdir(W$1(t)),await e.writeFile(t,r)}function resolveFileTree(e,t){return Object.entries(t).flatMap(([t,r])=>{let i=I$1(t,e);if(!i)throw Error(`Invalid file tree path ${JSON.stringify(t)}: it must resolve inside ${JSON.stringify(e)}.`);return r instanceof Uint8Array||typeof r==`string`?[[i,r]]:resolveFileTree(i,r)})}var schema12={properties:{name:{type:`string`},version:{type:`string`},mode:{type:`string`,const:`php-extension`},loadWithIniDirective:{$ref:`#/definitions/PHPExtensionLoadDirective`,description:"The first directive of the generated startup `.ini` file. Defaults to `extension`; use `zend_extension` for Zend extensions like Xdebug. Use `false` to stage the `.so` without registering it in php.ini."},iniEntries:{type:`object`,additionalProperties:{type:`string`},description:"Additional `key=value` lines for the generated startup `.ini` file."},env:{type:`object`,additionalProperties:{type:`string`},description:`Environment variables added before the extension is loaded.`},extensionDir:{type:`string`,description:"VFS directory where PHP.wasm writes the extension `.so` file and its per-extension ini file. Defaults to `PHP_EXTENSIONS_DIR`."},artifacts:{type:`array`,items:{type:`object`,properties:{phpVersion:{type:`string`,description:"PHP major/minor version, e.g. `8.4`."},sourcePath:{type:`string`,description:`Relative to the manifest URL/base URL, or an absolute URL.`},extraFiles:{$ref:`#/definitions/PHPExtensionManifestExtraFiles`,description:`URL-backed files needed only by this artifact.`}},required:[`phpVersion`,`sourcePath`],additionalProperties:!1}},extraFiles:{$ref:`#/definitions/PHPExtensionManifestExtraFiles`,description:`URL-backed files shared by every artifact in this manifest.`}}},schema15={properties:{nodes:{items:{properties:{type:{enum:[`file`,`directory`]}}}}}},func2=Object.prototype.hasOwnProperty,schema14={enum:[`extension`,`zend_extension`]};function validate12(e,{instancePath:t=``,parentData:r,parentDataProperty:i,rootData:a=e}={}){let s=null,O=0,N=O,F=!1,L=O;if(typeof e!=`string`){let e={instancePath:t,schemaPath:`#/definitions/PHPExtensionIniDirective/type`,keyword:`type`,params:{type:`string`},message:`must be string`};s===null?s=[e]:s.push(e),O++}if(e!==`extension`&&e!==`zend_extension`){let e={instancePath:t,schemaPath:`#/definitions/PHPExtensionIniDirective/enum`,keyword:`enum`,params:{allowedValues:schema14.enum},message:`must be equal to one of the allowed values`};s===null?s=[e]:s.push(e),O++}var B=L===O;if(F||=B,!F){let r=O;if(typeof e!=`boolean`){let e={instancePath:t,schemaPath:`#/anyOf/1/type`,keyword:`type`,params:{type:`boolean`},message:`must be boolean`};s===null?s=[e]:s.push(e),O++}if(e!==!1){let e={instancePath:t,schemaPath:`#/anyOf/1/const`,keyword:`const`,params:{allowedValue:!1},message:`must be equal to constant`};s===null?s=[e]:s.push(e),O++}var B=r===O;F||=B}if(F)O=N,s!==null&&(N?s.length=N:s=null);else{let e={instancePath:t,schemaPath:`#/anyOf`,keyword:`anyOf`,params:{},message:`must match a schema in anyOf`};return s===null?s=[e]:s.push(e),O++,validate12.errors=s,!1}return validate12.errors=s,O===0}function validate11(e,{instancePath:t=``,parentData:r,parentDataProperty:i,rootData:a=e}={}){let s=null,O=0;if(O===0){if(e&&typeof e==`object`&&!Array.isArray(e)){let r;if(e.name===void 0&&(r=`name`)||e.artifacts===void 0&&(r=`artifacts`))return validate11.errors=[{instancePath:t,schemaPath:`#/required`,keyword:`required`,params:{missingProperty:r},message:`must have required property '`+r+`'`}],!1;{let r=O;for(let r in e)if(!func2.call(schema12.properties,r))return validate11.errors=[{instancePath:t,schemaPath:`#/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:r},message:`must NOT have additional properties`}],!1;if(r===O){if(e.name!==void 0){let r=O;if(typeof e.name!=`string`)return validate11.errors=[{instancePath:t+`/name`,schemaPath:`#/properties/name/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var N=r===O}else var N=!0;if(N){if(e.version!==void 0){let r=O;if(typeof e.version!=`string`)return validate11.errors=[{instancePath:t+`/version`,schemaPath:`#/properties/version/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var N=r===O}else var N=!0;if(N){if(e.mode!==void 0){let r=e.mode,i=O;if(typeof r!=`string`)return validate11.errors=[{instancePath:t+`/mode`,schemaPath:`#/properties/mode/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;if(r!==`php-extension`)return validate11.errors=[{instancePath:t+`/mode`,schemaPath:`#/properties/mode/const`,keyword:`const`,params:{allowedValue:`php-extension`},message:`must be equal to constant`}],!1;var N=i===O}else var N=!0;if(N){if(e.loadWithIniDirective!==void 0){let r=O;validate12(e.loadWithIniDirective,{instancePath:t+`/loadWithIniDirective`,parentData:e,parentDataProperty:`loadWithIniDirective`,rootData:a})||(s=s===null?validate12.errors:s.concat(validate12.errors),O=s.length);var N=r===O}else var N=!0;if(N){if(e.iniEntries!==void 0){let r=e.iniEntries,i=O;if(O===i){if(r&&typeof r==`object`&&!Array.isArray(r))for(let e in r){let i=O;if(typeof r[e]!=`string`)return validate11.errors=[{instancePath:t+`/iniEntries/`+e.replace(/~/g,`~0`).replace(/\//g,`~1`),schemaPath:`#/properties/iniEntries/additionalProperties/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;if(i!==O)break}else return validate11.errors=[{instancePath:t+`/iniEntries`,schemaPath:`#/properties/iniEntries/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}var N=i===O}else var N=!0;if(N){if(e.env!==void 0){let r=e.env,i=O;if(O===i){if(r&&typeof r==`object`&&!Array.isArray(r))for(let e in r){let i=O;if(typeof r[e]!=`string`)return validate11.errors=[{instancePath:t+`/env/`+e.replace(/~/g,`~0`).replace(/\//g,`~1`),schemaPath:`#/properties/env/additionalProperties/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;if(i!==O)break}else return validate11.errors=[{instancePath:t+`/env`,schemaPath:`#/properties/env/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}var N=i===O}else var N=!0;if(N){if(e.extensionDir!==void 0){let r=O;if(typeof e.extensionDir!=`string`)return validate11.errors=[{instancePath:t+`/extensionDir`,schemaPath:`#/properties/extensionDir/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var N=r===O}else var N=!0;if(N){if(e.artifacts!==void 0){let r=e.artifacts,i=O;if(O===i){if(Array.isArray(r)){var F=!0;let e=r.length;for(let i=0;i<e;i++){let e=r[i],a=O;if(O===a){if(e&&typeof e==`object`&&!Array.isArray(e)){let r;if(e.phpVersion===void 0&&(r=`phpVersion`)||e.sourcePath===void 0&&(r=`sourcePath`))return validate11.errors=[{instancePath:t+`/artifacts/`+i,schemaPath:`#/properties/artifacts/items/required`,keyword:`required`,params:{missingProperty:r},message:`must have required property '`+r+`'`}],!1;{let r=O;for(let r in e)if(r!==`phpVersion`&&r!==`sourcePath`&&r!==`extraFiles`)return validate11.errors=[{instancePath:t+`/artifacts/`+i,schemaPath:`#/properties/artifacts/items/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:r},message:`must NOT have additional properties`}],!1;if(r===O){if(e.phpVersion!==void 0){let r=O;if(typeof e.phpVersion!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/phpVersion`,schemaPath:`#/properties/artifacts/items/properties/phpVersion/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var L=r===O}else var L=!0;if(L){if(e.sourcePath!==void 0){let r=O;if(typeof e.sourcePath!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/sourcePath`,schemaPath:`#/properties/artifacts/items/properties/sourcePath/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var L=r===O}else var L=!0;if(L){if(e.extraFiles!==void 0){let r=e.extraFiles,a=O;if(O===O){if(r&&typeof r==`object`&&!Array.isArray(r)){let e=O;for(let e in r)if(e!==`vfsRoot`&&e!==`nodes`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:e},message:`must NOT have additional properties`}],!1;if(e===O){if(r.vfsRoot!==void 0){let e=O;if(typeof r.vfsRoot!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/vfsRoot`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/vfsRoot/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var B=e===O}else var B=!0;if(B){if(r.nodes!==void 0){let e=r.nodes,a=O;if(O===a){if(Array.isArray(e)){var q=!0;let r=e.length;for(let a=0;a<r;a++){let r=e[a],s=O;if(O===s){if(r&&typeof r==`object`&&!Array.isArray(r)){let e;if(r.vfsPath===void 0&&(e=`vfsPath`))return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/required`,keyword:`required`,params:{missingProperty:e},message:`must have required property '`+e+`'`}],!1;{let e=O;for(let e in r)if(e!==`vfsPath`&&e!==`type`&&e!==`sourcePath`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:e},message:`must NOT have additional properties`}],!1;if(e===O){if(r.vfsPath!==void 0){let e=O;if(typeof r.vfsPath!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a+`/vfsPath`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/vfsPath/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var $=e===O}else var $=!0;if($){if(r.type!==void 0){let e=r.type,s=O;if(typeof e!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a+`/type`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/type/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;if(e!==`file`&&e!==`directory`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a+`/type`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/type/enum`,keyword:`enum`,params:{allowedValues:schema15.properties.nodes.items.properties.type.enum},message:`must be equal to one of the allowed values`}],!1;var $=s===O}else var $=!0;if($){if(r.sourcePath!==void 0){let e=O;if(typeof r.sourcePath!=`string`)return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a+`/sourcePath`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/sourcePath/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var $=e===O}else var $=!0}}}}}else return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes/`+a,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}if(s!==O)break}}else return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles/nodes`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/type`,keyword:`type`,params:{type:`array`},message:`must be array`}],!1}var B=a===O}else var B=!0}}}else return validate11.errors=[{instancePath:t+`/artifacts/`+i+`/extraFiles`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}var L=a===O}else var L=!0}}}}}else return validate11.errors=[{instancePath:t+`/artifacts/`+i,schemaPath:`#/properties/artifacts/items/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}if(a!==O)break}}else return validate11.errors=[{instancePath:t+`/artifacts`,schemaPath:`#/properties/artifacts/type`,keyword:`type`,params:{type:`array`},message:`must be array`}],!1}var N=i===O}else var N=!0;if(N){if(e.extraFiles!==void 0){let r=e.extraFiles,i=O;if(O===O){if(r&&typeof r==`object`&&!Array.isArray(r)){let e=O;for(let e in r)if(e!==`vfsRoot`&&e!==`nodes`)return validate11.errors=[{instancePath:t+`/extraFiles`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:e},message:`must NOT have additional properties`}],!1;if(e===O){if(r.vfsRoot!==void 0){let e=O;if(typeof r.vfsRoot!=`string`)return validate11.errors=[{instancePath:t+`/extraFiles/vfsRoot`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/vfsRoot/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var ae=e===O}else var ae=!0;if(ae){if(r.nodes!==void 0){let e=r.nodes,i=O;if(O===i){if(Array.isArray(e)){var ce=!0;let r=e.length;for(let i=0;i<r;i++){let r=e[i],a=O;if(O===a){if(r&&typeof r==`object`&&!Array.isArray(r)){let e;if(r.vfsPath===void 0&&(e=`vfsPath`))return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/required`,keyword:`required`,params:{missingProperty:e},message:`must have required property '`+e+`'`}],!1;{let e=O;for(let e in r)if(e!==`vfsPath`&&e!==`type`&&e!==`sourcePath`)return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:e},message:`must NOT have additional properties`}],!1;if(e===O){if(r.vfsPath!==void 0){let e=O;if(typeof r.vfsPath!=`string`)return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i+`/vfsPath`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/vfsPath/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var ue=e===O}else var ue=!0;if(ue){if(r.type!==void 0){let e=r.type,a=O;if(typeof e!=`string`)return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i+`/type`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/type/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;if(e!==`file`&&e!==`directory`)return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i+`/type`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/type/enum`,keyword:`enum`,params:{allowedValues:schema15.properties.nodes.items.properties.type.enum},message:`must be equal to one of the allowed values`}],!1;var ue=a===O}else var ue=!0;if(ue){if(r.sourcePath!==void 0){let e=O;if(typeof r.sourcePath!=`string`)return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i+`/sourcePath`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/properties/sourcePath/type`,keyword:`type`,params:{type:`string`},message:`must be string`}],!1;var ue=e===O}else var ue=!0}}}}}else return validate11.errors=[{instancePath:t+`/extraFiles/nodes/`+i,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/items/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}if(a!==O)break}}else return validate11.errors=[{instancePath:t+`/extraFiles/nodes`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/properties/nodes/type`,keyword:`type`,params:{type:`array`},message:`must be array`}],!1}var ae=i===O}else var ae=!0}}}else return validate11.errors=[{instancePath:t+`/extraFiles`,schemaPath:`#/definitions/PHPExtensionManifestExtraFiles/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}var N=i===O}else var N=!0}}}}}}}}}}}else return validate11.errors=[{instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`object`},message:`must be object`}],!1}return validate11.errors=s,O===0}function validate10(e,{instancePath:t=``,parentData:r,parentDataProperty:i,rootData:a=e}={}){let s=null,O=0;return validate11(e,{instancePath:t,parentData:r,parentDataProperty:i,rootData:a})||(s=s===null?validate11.errors:s.concat(validate11.errors),O=s.length),validate10.errors=s,O===0}var PHP_EXTENSIONS_DIR=`/internal/shared/extensions`,MAX_EXTENSION_SIDECAR_FILE_REQUESTS=5;async function resolvePHPExtension(e){let t=e.fetch??globalThis.fetch,r=e.source,i=e.name,a,s={},O=[],N,F,L,B;if(r.format===`so`){if(i||=r.name,!i)throw Error(`name is required when loading an extension from direct bytes.`);a=toUint8Array(r.bytes)}else if(r.format===`url`){let e;try{e=new URL(String(r.url))}catch{throw Error(`source.url must be an absolute URL when loading a PHP extension from a direct URL. Received: ${String(r.url)}`)}if(i||=r.name,!i&&e.pathname.endsWith(`.so`)&&(i=j$1(e.pathname).slice(0,-3)),!i)throw Error(`name is required when loading an extension from a direct URL.`);a=await fetchBytes(t,e)}else{let q,$;if(`manifest`in r?(q=r.manifest,r.baseUrl&&($=new URL(String(r.baseUrl)))):($=new URL(String(r.manifestUrl)),q=await(await t($)).json()),!validate10(q))throw Error(`Invalid PHP extension manifest: ${JSON.stringify(validate10.errors)}`);let ae=q;if(!$)throw Error(`Manifest artifacts require a manifest URL or baseUrl so relative files can be resolved.`);let ce=ae.artifacts.find(t=>t.phpVersion===e.phpVersion);if(!ce)throw Error(`No extension artifact found for PHP ${e.phpVersion}.`);i??=ae.name,N=ae.loadWithIniDirective,F=ae.iniEntries,L=ae.env,B=ae.extensionDir;let ue=new v$1({concurrency:MAX_EXTENSION_SIDECAR_FILE_REQUESTS}),fe=[];for(let e of[ae.extraFiles,ce.extraFiles])for(let r of e?.nodes??[]){let i=m(e.vfsRoot??``,r.vfsPath);if(r.type===`directory`){O.push(i);continue}if(!r.sourcePath)continue;let a=new URL(r.sourcePath,$);fe.push(ue.run(()=>fetchBytes(t,a)).then(e=>{s[i]=e}))}let[pe]=await Promise.all([fetchBytes(t,new URL(ce.sourcePath,$)),...fe]);a=pe}let q=c$1(e.extensionDir??B??`/internal/shared/extensions`);e.extraFiles&&(Object.assign(s,e.extraFiles.files),O.push(...e.extraFiles.directories??[]));let $=e.loadWithIniDirective??N??`extension`,ae={...F,...e.iniEntries},ce=m(q,`${i}.so`),ue=createPHPExtensionIniFile({directive:$,extensionDir:q,name:i,soPath:ce,iniEntries:ae}),fe={...L,...e.env};return{soPath:ce,soBytes:a,...ue,extraFiles:{files:s,directories:O},env:Object.keys(fe).length?fe:void 0,extensionDir:q}}function withResolvedPHPExtensions(e,t){var r;if(!t.length)return e;let i={...e.ENV};for(let e of t){if(Object.assign(i,e.env),!e.iniPath)continue;let t=i.PHP_INI_SCAN_DIR?.split(`:`)??[];t.includes(e.extensionDir)||(t.push(e.extensionDir),i.PHP_INI_SCAN_DIR=t.join(`:`))}let a=e.preRun??[];return{...e,ENV:i,preRun:[...a,e=>{for(let r of t)installPHPExtensionFilesSync(e.FS,r)}]}}function installPHPExtensionFilesSync(e,t){let r;if(`soPath`in t)r=t;else{let e=t.extensionDir??`/internal/shared/extensions`,i=t.loadWithIniDirective??`extension`,a=m(e,`${t.name}.so`),s=createPHPExtensionIniFile({directive:i,extensionDir:e,name:t.name,soPath:a,iniEntries:t.iniEntries});r={soPath:a,soBytes:toUint8Array(t.soBytes),...s,extraFiles:t.extraFiles,env:t.env,extensionDir:e}}if(mkdirIfMissing(e,r.extensionDir),e.writeFile(r.soPath,r.soBytes),r.iniPath&&r.iniContent!==void 0&&e.writeFile(r.iniPath,r.iniContent),r.extraFiles){let{directories:t=[],files:i}=r.extraFiles;for(let r of t)mkdirIfMissing(e,r);for(let[t,r]of Object.entries(i))mkdirIfMissing(e,W$1(t)),e.writeFile(t,r)}return r}function createPHPExtensionIniFile(e){if(e.directive===!1)return{};let t=[`${e.directive}=${e.soPath}`,...Object.entries(e.iniEntries??{}).map(([e,t])=>`${e}=${t}`)];return{iniPath:m(e.extensionDir,`${e.name}.ini`),iniContent:t.join(`
`)}}function mkdirIfMissing(e,t){FSHelpers.fileExists(e,t)||e.mkdirTree(t)}async function fetchBytes(e,t){let r=await e(t);if(!r.ok)throw Error(`Failed to fetch ${String(t)}: ${r.status}`);return new Uint8Array(await r.arrayBuffer())}function toUint8Array(e){return e instanceof Uint8Array?e:new Uint8Array(e)}function isLegacyPhpInstance(e){var t;let r=e[Object.getOwnPropertySymbols(e)[0]]?.phpVersion?.major;return typeof r==`number`&&r<7}function ensureProxyFSHasMmapSupport(e){let t=e[Object.getOwnPropertySymbols(e)[0]],r=t.PROXYFS,i=t.FS;r.stream_ops.mmap||(r.stream_ops.mmap=function(e,r,a,s,O){if(!i.isFile(e.node.mode))throw new i.ErrnoError(19);if(a!==0)throw new i.ErrnoError(22);let N=t.malloc(r);if(!N)throw new i.ErrnoError(48);let F=t.HEAPU8.subarray(N,N+r),L=0;for(;L<r;){let t=e.stream_ops.read(e,F,L,r-L,L);if(t<=0)break;L+=t}if(L!==r)throw t.free(N),new i.ErrnoError(5);return{ptr:N,allocated:!0}},r.stream_ops.msync=function(e,t,r,i,a){return a&2||e.stream_ops.write(e,t,r,i,r,!1),0})}async function proxyFileSystem(e,t,r){let i=isLegacyPhpInstance(t),a=Object.getOwnPropertySymbols(e)[0];for(let s of r)e.fileExists(s)||e.mkdir(s),t.mkdir(s),await t.mount(s,t=>{i||ensureProxyFSHasMmapSupport(t);let r=Object.getOwnPropertySymbols(t)[0];return t[r].FS.mount(t[r].PROXYFS,{root:s,fs:e[a].FS},s),()=>{try{t[r].FS.unmount(s)}catch{}}});t.addEventListener(`request.end`,()=>{e.dispatchEvent({type:`proxyfs.request.end`})})}function isPathToSharedFS(e,t){var r;return e[Object.getOwnPropertySymbols(e)[0]].FS.lookupPath(t,{noent_okay:!0})?.node?.isSharedFS??!1}function sandboxedSpawnHandlerFactory(e){return S$1(async function(t,r,i){r.notifySpawn(),t?.[0]===`/bin/sh`&&t?.[1]===`-c`&&typeof t[2]==`string`&&(t=x$1(t[2])),t[0]===`exec`&&t.shift(),(t[0].endsWith(`.php`)||t[0].endsWith(`.phar`))&&t.unshift(`php`);let a=t[0].split(`/`).pop();if(t[0]===`/usr/bin/env`&&t[1]===`stty`&&t[2]===`size`)r.stdout(`18 140`),r.exit(0);else if(a===`tput`&&t[1]===`cols`)r.stdout(`140`),r.exit(0);else if(a===`less`){r.on(`stdin`,e=>{r.stdout(e)}),await new Promise(e=>{r.childProcess.stdin.on(`finish`,()=>{e(!0)})}),r.exit(0);return}if(![`php`,`ls`,`pwd`].includes(a??``)){r.exit(127);return}if(!e){T$1.warn(`Tried to spawn a PHP subprocess, but the sandboxed spawn handler was created without a getPHPInstance function.`),r.exit(127);return}let{php:s,reap:O}=await e();try{i.cwd&&await s.chdir(i.cwd);let e=await s.cwd();switch(a){case`php`:{let e=await s.cli(t,{env:{...i.env,SCRIPT_PATH:t[1],SHELL_PIPE:`0`}});e.stdout.pipeTo(new WritableStream({write(e){r.stdout(e)}})),e.stderr.pipeTo(new WritableStream({write(e){r.stderr(e)}})),r.exit(await e.exitCode);break}case`ls`:{let i=await s.listFiles(t[1]??e);for(let e of i)r.stdout(e+`
`);await new Promise(e=>setTimeout(e,10)),r.exit(0);break}case`pwd`:r.stdout(e+`
`),await new Promise(e=>setTimeout(e,10)),r.exit(0)}}catch(e){let t=e instanceof Error?e.message+`
`+e.stack:typeof e==`object`&&e?JSON.stringify(e,Object.getOwnPropertyNames(e)):String(e);throw r.stderr(`[spawn error] ${t}`),r.exit(1),e}finally{O()}})}function exposeSync(e,t,r,i=[`*`]){return expose(e,t,i,r.afterResponseSent)}function createSyncProxy(e,t=[],r){return new Proxy(()=>{},{get(i,a){return a===`then`&&!t.length?{then:(t,i)=>i(createSyncProxy(e,[],r))}:createSyncProxy(e,[...t,a],r)},set(i,a,s){let[O,N]=toWireValue(s);return r.send(e,{type:MessageType.SET,path:[...t,a].map(String),value:O},N),!0},apply(i,a,s){if(t.at(-1)===`bind`)return createSyncProxy(e,t.slice(0,-1),r);let[O,N]=processArguments(s);return fromWireValue(r.send(e,{type:MessageType.APPLY,path:t.map(String),argumentList:O},N))},construct(i,a){let[s,O]=processArguments(a);return fromWireValue(r.send(e,{type:MessageType.CONSTRUCT,path:t.map(String),argumentList:s},O))}})}function wrapSync(e,t){return createSyncProxy(e,[],t)}var NodeSABSyncReceiveMessageTransport=class e{static async create(){if(!e.receiveMessageOnPort)try{e.receiveMessageOnPort=require___vite_browser_external().receiveMessageOnPort}catch{e.receiveMessageOnPort=await __vitePreload(()=>import(`./__vite-browser-external-D5uN_t1O.js`).then(e=>__toESM(e.default,1)).then(e=>e.receiveMessageOnPort),__vite__mapDeps([0,1]))}return new e}constructor(){}afterResponseSent(e){let{notifyBuffer:t}=e.data;if(t){let e=new Int32Array(t);e[0]=1,Atomics.notify(e,0)}}send(t,r,i){var a;let s=new SharedArrayBuffer(4),O=new Int32Array(s);O[0]=0;let N=generateUUID();if(t.postMessage({...r,id:N,notifyBuffer:s},i),Atomics.wait(O,0,0,5e3)===`timed-out`)throw Error(`Timeout waiting for response`);for(;;){let r=e.receiveMessageOnPort(t);if(r.message?.id===N)return r.message;if(!r)throw Error(`No response received`)}}},proxyMarker=Symbol(`Comlink.proxy`),createEndpoint=Symbol(`Comlink.endpoint`),releaseProxy=Symbol(`Comlink.releaseProxy`),finalizer=Symbol(`Comlink.finalizer`),throwMarker=Symbol(`Comlink.thrown`),WireValueType={RAW:`RAW`,HANDLER:`HANDLER`},MessageType={GET:`GET`,SET:`SET`,APPLY:`APPLY`,CONSTRUCT:`CONSTRUCT`,ENDPOINT:`ENDPOINT`,RELEASE:`RELEASE`},isObject=e=>typeof e==`object`&&!!e||typeof e==`function`,proxyTransferHandler={canHandle:e=>isObject(e)&&e[proxyMarker],serialize(e){let{port1:t,port2:r}=new MessageChannel;return expose(e,t),[r,[r]]},deserialize(e){return e.start(),wrap(e)}},throwTransferHandler$1={canHandle:e=>isObject(e)&&throwMarker in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(Error(e.value.message),e.value):e.value}},transferHandlers=new Map([[`proxy`,proxyTransferHandler],[`throw`,throwTransferHandler$1]]);function isAllowedOrigin(e,t){for(let r of e)if(t===r||r===`*`||r instanceof RegExp&&r.test(t))return!0;return!1}function expose(e,t=globalThis,r=[`*`],i){t.addEventListener(`message`,function a(s){if(!s||!s.data)return;if(!isAllowedOrigin(r,s.origin)){console.warn(`Invalid origin '${s.origin}' for comlink proxy`);return}let{id:O,type:N,path:F}={path:[],...s.data},L=(s.data.argumentList||[]).map(fromWireValue),B;try{let t=F.slice(0,-1).reduce((e,t)=>e[t],e),r=F.reduce((e,t)=>e[t],e);switch(N){case MessageType.GET:B=r;break;case MessageType.SET:t[F.slice(-1)[0]]=fromWireValue(s.data.value),B=!0;break;case MessageType.APPLY:B=r.apply(t,L);break;case MessageType.CONSTRUCT:B=proxy(new r(...L));break;case MessageType.ENDPOINT:{let{port1:t,port2:r}=new MessageChannel;expose(e,r),B=transfer(t,[t])}break;case MessageType.RELEASE:B=void 0;break;default:return}}catch(e){B={value:e,[throwMarker]:0}}Promise.resolve(B).catch(e=>({value:e,[throwMarker]:0})).then(r=>{let[i,s]=toWireValue(r);t.postMessage({...i,id:O},s),N===MessageType.RELEASE&&(t.removeEventListener(`message`,a),closeEndPoint(t),finalizer in e&&typeof e[finalizer]==`function`&&e[finalizer]())}).catch(()=>{let[e,r]=toWireValue({value:TypeError(`Unserializable return value`),[throwMarker]:0});t.postMessage({...e,id:O},r)}).finally(()=>{i?.(s)})}),t.start&&t.start()}function isMessagePort(e){return e.constructor.name===`MessagePort`}function closeEndPoint(e){isMessagePort(e)&&e.close()}function wrap(e,t){let r=new Map;return e.addEventListener(`message`,function(e){let{data:t}=e;if(!t||!t.id)return;let i=r.get(t.id);if(i)try{i(t)}finally{r.delete(t.id)}}),createProxy(e,r,[],t)}function throwIfProxyReleased(e){if(e)throw Error(`Proxy has been released and is not useable`)}function releaseEndpoint(e){return requestResponseMessage(e,new Map,{type:MessageType.RELEASE}).then(()=>{closeEndPoint(e)})}var proxyCounter=new WeakMap,proxyFinalizers=`FinalizationRegistry`in globalThis&&new FinalizationRegistry(e=>{let t=(proxyCounter.get(e)||0)-1;proxyCounter.set(e,t),t===0&&releaseEndpoint(e)});function registerProxy(e,t){let r=(proxyCounter.get(t)||0)+1;proxyCounter.set(t,r),proxyFinalizers&&proxyFinalizers.register(e,t,e)}function unregisterProxy(e){proxyFinalizers&&proxyFinalizers.unregister(e)}function createProxy(e,t,r=[],i=function(){}){let a=!1,s=new Proxy(i,{get(i,O){if(throwIfProxyReleased(a),O===releaseProxy)return()=>{unregisterProxy(s),releaseEndpoint(e),t.clear(),a=!0};if(O===`then`){if(r.length===0)return{then:()=>s};let i=requestResponseMessage(e,t,{type:MessageType.GET,path:r.map(e=>e.toString())}).then(fromWireValue);return i.then.bind(i)}return createProxy(e,t,[...r,O])},set(i,s,O){throwIfProxyReleased(a);let[N,F]=toWireValue(O);return requestResponseMessage(e,t,{type:MessageType.SET,path:[...r,s].map(e=>e.toString()),value:N},F).then(fromWireValue)},apply(i,s,O){throwIfProxyReleased(a);let N=r[r.length-1];if(N===createEndpoint)return requestResponseMessage(e,t,{type:MessageType.ENDPOINT}).then(fromWireValue);if(N===`bind`)return createProxy(e,t,r.slice(0,-1));let[F,L]=processArguments(O);return requestResponseMessage(e,t,{type:MessageType.APPLY,path:r.map(e=>e.toString()),argumentList:F},L).then(fromWireValue)},construct(i,s){throwIfProxyReleased(a);let[O,N]=processArguments(s);return requestResponseMessage(e,t,{type:MessageType.CONSTRUCT,path:r.map(e=>e.toString()),argumentList:O},N).then(fromWireValue)}});return registerProxy(s,e),s}function myFlat(e){return Array.prototype.concat.apply([],e)}function processArguments(e){let t=e.map(toWireValue);return[t.map(e=>e[0]),myFlat(t.map(e=>e[1]))]}var transferCache=new WeakMap;function transfer(e,t){return transferCache.set(e,t),e}function proxy(e){return Object.assign(e,{[proxyMarker]:!0})}function windowEndpoint(e,t=globalThis,r=`*`){let i=new WeakMap;return{postMessage:(t,i)=>e.postMessage(t,r,i),addEventListener:(r,a,s)=>{let O=i.get(a);O||(O=r=>{r.source===e&&(typeof a==`function`?a.call(t,r):a.handleEvent(r))},i.set(a,O)),t.addEventListener(r,O,s)},removeEventListener:(e,r,a)=>{let s=i.get(r);s&&t.removeEventListener(e,s,a)}}}function toWireValue(e){for(let[t,r]of transferHandlers)if(r.canHandle(e)){let[i,a]=r.serialize(e);return[{type:WireValueType.HANDLER,name:t,value:i},a]}return[{type:WireValueType.RAW,value:e},transferCache.get(e)||[]]}function fromWireValue(e){switch(e.type){case WireValueType.HANDLER:return transferHandlers.get(e.name).deserialize(e.value);case WireValueType.RAW:return e.value}}function requestResponseMessage(e,t,r,i){return new Promise(a=>{let s=generateUUID();t.set(s,a),e.start&&e.start(),e.postMessage({id:s,...r},i)})}function generateUUID(){return[,,,,].fill(0).map(()=>Math.floor(Math.random()*(2**53-1)).toString(16)).join(`-`)}function nodeEndpoint(e){let t=new WeakMap;return{postMessage:e.postMessage.bind(e),addEventListener:(r,i)=>{let a=e=>{`handleEvent`in i?i.handleEvent({data:e}):i({data:e})};e.on(`message`,a),t.set(i,a)},removeEventListener:(r,i)=>{let a=t.get(i);a&&(e.off(`message`,a),t.delete(i))},start:e.start&&e.start.bind(e)}}var proxyByListener=new WeakMap;function nodeProcessEndpoint(e){let t=e||process;if(typeof t.send!=`function`)throw Error(`IPC channel is not available. Did you forget to fork the process?`);let r=t;return{postMessage(e,t){var i;if(t&&t.length>0)throw Error(`Transferable objects are not supported for nodeProcessEndpoint`);(i=r.send)==null||i.call(r,e)},addEventListener(e,t){let i=typeof t==`function`?e=>t({data:e}):e=>t.handleEvent({data:e});proxyByListener.set(t,i),r.addListener(e,i)},removeEventListener(e,t){let i=proxyByListener.get(t);i&&(proxyByListener.delete(t),r.removeListener(e,i))},start(){}}}var list=[Error,EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,AggregateError,globalThis.DOMException,globalThis.AssertionError,globalThis.SystemError].filter(Boolean).map(e=>[e.name,e]),errorConstructors=new Map(list),NonError=class e extends Error{constructor(t){super(e._prepareSuperMessage(t)),this.name=`NonError`}static _prepareSuperMessage(e){try{return JSON.stringify(e)}catch{return String(e)}}},errorProperties=[{property:`name`,enumerable:!1},{property:`message`,enumerable:!1},{property:`stack`,enumerable:!1},{property:`code`,enumerable:!0},{property:`cause`,enumerable:!1},{property:`errors`,enumerable:!1}],toJsonWasCalled=new WeakSet,toJSON=e=>{toJsonWasCalled.add(e);let t=e.toJSON();return toJsonWasCalled.delete(e),t},newError=e=>{let t=errorConstructors.get(e)??Error;return t===AggregateError?new t([]):new t},destroyCircular=({from:e,seen:t,to:r,forceEnumerable:i,maxDepth:a,depth:s,useToJSON:O,serialize:N})=>{if(r||=Array.isArray(e)?[]:!N&&isErrorLike(e)?newError(e.name):{},t.push(e),s>=a)return r;if(O&&typeof e.toJSON==`function`&&!toJsonWasCalled.has(e))return toJSON(e);let F=e=>destroyCircular({from:e,seen:[...t],forceEnumerable:i,maxDepth:a,depth:s,useToJSON:O,serialize:N});for(let[i,a]of Object.entries(e))if(a&&a instanceof Uint8Array&&a.constructor.name===`Buffer`)r[i]=`[object Buffer]`;else if(typeof a==`object`&&a&&typeof a.pipe==`function`)r[i]=`[object Stream]`;else if(typeof a!=`function`){if(!a||typeof a!=`object`){try{r[i]=a}catch{}continue}if(!t.includes(e[i])){s++,r[i]=F(e[i]);continue}r[i]=`[Circular]`}if(N||r instanceof Error)for(let{property:t,enumerable:a}of errorProperties)e[t]!==void 0&&e[t]!==null&&Object.defineProperty(r,t,{value:isErrorLike(e[t])||Array.isArray(e[t])?F(e[t]):e[t],enumerable:i?!0:a,configurable:!0,writable:!0});return r};function serializeError(e,t={}){let{maxDepth:r=1/0,useToJSON:i=!0}=t;return typeof e==`object`&&e?destroyCircular({from:e,seen:[],forceEnumerable:!0,maxDepth:r,depth:0,useToJSON:i,serialize:!0}):typeof e==`function`?`[Function: ${e.name||`anonymous`}]`:e}function deserializeError(e,t={}){let{maxDepth:r=1/0}=t;return e instanceof Error?e:isMinimumViableSerializedError(e)?destroyCircular({from:e,seen:[],to:newError(e.name),maxDepth:r,depth:0,serialize:!1}):new NonError(e)}function isErrorLike(e){return!!e&&typeof e==`object`&&typeof e.name==`string`&&typeof e.message==`string`&&typeof e.stack==`string`}function isMinimumViableSerializedError(e){return!!e&&typeof e==`object`&&typeof e.message==`string`&&!Array.isArray(e)}var releaseApiProxy=releaseProxy;async function consumeAPISync(e){return setupTransferHandlers(),wrapSync(e,await NodeSABSyncReceiveMessageTransport.create())}function consumeAPI(e,t=void 0){setupTransferHandlers();let r;if(typeof process<`u`&&typeof process.versions<`u`&&typeof process.versions.node<`u`){if(`postMessage`in e)r=nodeEndpoint(e);else if(`send`in e&&`addListener`in e)r=nodeProcessEndpoint(e);else throw Error(`consumeAPI: remote does not look like a Worker, MessagePort, or Process`)}else r=e instanceof Worker||e instanceof MessagePort?e:deferredEndpoint(connectWindowApiThroughMessagePort(wrap(windowEndpoint(e,t))));let i=wrap(r),a=proxyClone(i);return new Proxy(a,{get:(e,t)=>t===`isConnected`?async()=>{for(;;)try{await runWithTimeout(i.isConnected(),200);break}catch{}}:i[t]})}async function connectWindowApiThroughMessagePort(e){for(;;)try{return await runWithTimeout(e.isConnected(),200),await e[createEndpoint]()}catch{}}function deferredEndpoint(e){let t,r=!1,i=[],a=[];return e.then(e=>{t=e;for(let{type:e,listener:r,options:a}of i)t.addEventListener(e,r,a);r&&t.start();for(let{message:e,transfer:r}of a)r?t.postMessage(e,r):t.postMessage(e);a.length=0}),{postMessage(e,r){t?r?t.postMessage(e,r):t.postMessage(e):a.push({message:e,transfer:r})},addEventListener(e,r,a){t?t.addEventListener(e,r,a):i.push({type:e,listener:r,options:a})},removeEventListener(e,r,a){if(t){t.removeEventListener(e,r,a);return}let s=i.findIndex(t=>t.type===e&&t.listener===r&&t.options===a);s!==-1&&i.splice(s,1)},start(){t?t.start():r=!0}}}async function runWithTimeout(e,t){return new Promise((r,i)=>{let a=setTimeout(i,t);e.then(e=>{clearTimeout(a),r(e)},e=>{clearTimeout(a),i(e)})})}function exposeAPI(e,t,r){let{setReady:i,setFailed:a,exposedApi:s}=prepareForExpose(e,t),O;if(r){if(`addEventListener`in r)O=r;else if(`postMessage`in r)O=nodeEndpoint(r);else if(`send`in r&&`addListener`in r)O=nodeProcessEndpoint(r);else throw Error(`exposeAPI: targetWorker does not look like a Worker, MessagePort, or Process`)}else O=typeof window<`u`?windowEndpoint(self.parent):void 0;return expose(s,O),[i,a,s]}async function exposeSyncAPI(e,t){let{setReady:r,setFailed:i,exposedApi:a}=prepareForExpose(e),s=await NodeSABSyncReceiveMessageTransport.create();return exposeSync(a,nodeEndpoint(t),s),[r,i,a]}function prepareForExpose(e,t){setupTransferHandlers();let r=Promise.resolve(),i,a,s=new Promise((e,t)=>{i=e,a=t}),O=proxyClone(e),N=new Proxy(O,{get:(e,i)=>i===`isConnected`?()=>r:i===`isReady`?()=>s:i in e?e[i]:t?.[i]});return{setReady:i,setFailed:a,exposedApi:N}}var isTransferHandlersSetup=!1;function setupTransferHandlers(){if(isTransferHandlersSetup)return;isTransferHandlersSetup=!0,transferHandlers.set(`EVENT`,{canHandle:e=>e instanceof CustomEvent,serialize:e=>[{detail:e.detail},[]],deserialize:e=>e}),transferHandlers.set(`FUNCTION`,{canHandle:e=>typeof e==`function`,serialize(e){let{port1:t,port2:r}=new MessageChannel;return expose(e,t),[r,[r]]},deserialize(e){return e.start(),wrap(e)}}),transferHandlers.set(`MESSAGE_PORT`,{canHandle:e=>e instanceof MessagePort,serialize(e){return[e,[e]]},deserialize(e){return e}});let e={canHandle:e=>typeof ReadableStream<`u`&&e instanceof ReadableStream,serialize(e){if(supportsTransferableStreams())return[{stream:e},[e]];let t=streamToPort(e);return[{port:t},[t]]},deserialize(e){return e.stream||portToStream(e.port)}};transferHandlers.set(`READABLE_STREAM`,e),transferHandlers.set(`EVENT_WITH_READABLE_STDIN`,{canHandle:t=>typeof t==`object`&&!!t&&A$1 in t&&t[A$1]===!0&&`type`in t&&typeof t.type==`string`&&`stdin`in t&&e.canHandle(t.stdin),serialize(t){let[r,i]=e.serialize(t.stdin);return[{...t,stdin:r},i]},deserialize(t){return{...t,stdin:e.deserialize(t.stdin),[A$1]:!0}}}),transferHandlers.set(`PHPResponse`,{canHandle:e=>typeof e==`object`&&!!e&&`headers`in e&&`bytes`in e&&`errors`in e&&`exitCode`in e&&`httpStatusCode`in e,serialize(e){let t=e.toRawData(),r=[];return t.bytes.buffer.byteLength>0&&r.push(t.bytes.buffer),[t,r]},deserialize(e){return PHPResponse.fromRawData(e)}});let t=transferHandlers.get(`throw`),r=t?.serialize;t.serialize=({value:e})=>{let t=r({value:e});return e.response&&(t[0].value.response=e.response),e.source&&(t[0].value.source=e.source),t},transferHandlers.set(`StreamedPHPResponse`,{canHandle:e=>e instanceof StreamedPHPResponse,serialize(e){let t=supportsTransferableStreams(),r=promiseToPort(e.exitCode),i=e.getHeadersStream();if(t)return[{__type:`StreamedPHPResponse`,headers:i,stdout:e.stdout,stderr:e.stderr,exitCodePort:r},[i,e.stdout,e.stderr,r]];let a=streamToPort(i),s=streamToPort(e.stdout),O=streamToPort(e.stderr);return[{__type:`StreamedPHPResponse`,headersPort:a,stdoutPort:s,stderrPort:O,exitCodePort:r},[a,s,O,r]]},deserialize(e){if(e.headers&&e.stdout&&e.stderr){let t=portToPromise(e.exitCodePort);return new StreamedPHPResponse(e.headers,e.stdout,e.stderr,t)}return new StreamedPHPResponse(portToStream(e.headersPort),portToStream(e.stdoutPort),portToStream(e.stderrPort),portToPromise(e.exitCodePort))}})}var _cachedSupportsTransferableStreams;function supportsTransferableStreams(){if(typeof ReadableStream>`u`&&(_cachedSupportsTransferableStreams=!1),_cachedSupportsTransferableStreams===void 0)try{let{port1:e}=new MessageChannel,t=new ReadableStream;e.postMessage(t,[t]);try{e.close()}catch{}_cachedSupportsTransferableStreams=!0}catch{_cachedSupportsTransferableStreams=!1}return _cachedSupportsTransferableStreams}function streamToPort(e){let{port1:t,port2:r}=new MessageChannel,i=e.getReader(),a=e=>{var t;e.data?.t===`cancel`&&i.cancel().catch(()=>{})};return t.addEventListener(`message`,a),t.start(),(async()=>{try{for(;;){let{done:e,value:r}=await i.read();if(e){try{t.postMessage({t:`close`})}catch{}try{t.close()}catch{}break}if(r){let e=r.slice(),i=e.buffer;try{t.postMessage({t:`chunk`,b:i},[i])}catch{t.postMessage({t:`chunk`,b:e.buffer.slice(0)})}}}}catch(e){try{t.postMessage({t:`error`,m:e?.message||String(e)})}catch{}}finally{t.removeEventListener(`message`,a);try{t.close()}catch{}}})(),r}function portToStream(e){return new ReadableStream({start(t){let r=e=>{let r=e.data;if(r)switch(r.t){case`chunk`:try{t.enqueue(new Uint8Array(r.b))}catch{i()}break;case`close`:safeStreamClose(t),i();break;case`error`:safeStreamError(t,Error(r.m||`Stream error`)),i()}},i=()=>{var t;try{(t=e.removeEventListener)==null||t.call(e,`message`,r)}catch{}try{e.onmessage=null}catch{}try{e.close()}catch{}};e.addEventListener?e.addEventListener(`message`,r):e.on?e.on(`message`,e=>r({data:e})):e.onmessage=r,typeof e.start==`function`&&e.start()},cancel(){try{e.postMessage({t:`cancel`})}catch{}try{e.close()}catch{}}})}function promiseToPort(e){let{port1:t,port2:r}=new MessageChannel;return e.then(e=>{try{t.postMessage({t:`resolve`,v:e})}catch{}}).catch(e=>{try{t.postMessage({t:`reject`,m:e?.message||String(e)})}catch{}}).finally(()=>{try{t.close()}catch{}}),r}function portToPromise(e){return new Promise((t,r)=>{let i=e=>{let i=e.data;i&&(i.t===`resolve`?(a(),t(i.v)):i.t===`reject`&&(a(),r(Error(i.m||``))))},a=()=>{var t;try{(t=e.removeEventListener)==null||t.call(e,`message`,i)}catch{}try{e.onmessage=null}catch{}try{e.close()}catch{}};e.addEventListener?e.addEventListener(`message`,i):e.on?e.on(`message`,e=>i({data:e})):e.onmessage=i,typeof e.start==`function`&&e.start()})}var throwTransferHandler=transferHandlers.get(`throw`),throwTransferHandlerCustom={canHandle:throwTransferHandler.canHandle,serialize:({value:e})=>{let t;return e instanceof Error?(t={isError:!0,value:serializeError(e)},t.value.originalErrorClassName=e.constructor.name):t={isError:!1,value:e},[t,[]]},deserialize:e=>{if(e.isError){let t=deserializeError(e.value),r=Error(`Comlink method call failed`),i=t;for(;i.cause;)i=i.cause;throw i.cause=r,t}throw e.value}};transferHandlers.set(`throw`,throwTransferHandlerCustom);function proxyClone(e){return new Proxy(e,{get(e,t){switch(typeof e[t]){case`function`:return(...r)=>e[t](...r);case`object`:return e[t]===null?e[t]:proxyClone(e[t]);case`undefined`:case`number`:case`string`:return e[t];default:return proxy(e[t])}}})}function safeStreamError(e,t){try{e.error(t)}catch{}}function safeStreamClose(e){try{e.close()}catch{}}var MAX_ADDRESSABLE_FILE_OFFSET=BigInt(2**53-1),IntervalNode=class{constructor(e){this.left=null,this.right=null,this.range=e,this.max=e.end}},FileLockIntervalTree=class{constructor(){this.root=null}isEmpty(){return this.root===null}insert(e){this.root=this.insertNode(this.root,e)}findOverlapping(e){let t=[];return this.findOverlappingRanges(this.root,e,t),t}remove(e){this.root=this.removeNode(this.root,e)}findLocksForProcess(e){let t=[];return this.findLocksForProcessInNode(this.root,e,t),t}findStrictestExistingLockType(){let e=`unlocked`,t=r=>{if(r){if(r.range.type===`exclusive`){e=`exclusive`;return}r.range.type===`shared`&&(e=`shared`),t(r.left),t(r.right)}};return t(this.root),e}insertNode(e,t){return e?(t.start<e.range.start?e.left=this.insertNode(e.left,t):e.right=this.insertNode(e.right,t),e.max=this.bigintMax(e.max,t.end),e):new IntervalNode(t)}bigintMax(...e){return e.reduce((e,t)=>t>e?t:e,e[0])}findOverlappingRanges(e,t,r){e&&(this.doRangesOverlap(e.range,t)&&r.push(e.range),e.left&&e.left.max>=t.start&&this.findOverlappingRanges(e.left,t,r),e.right&&e.range.start<=t.end&&this.findOverlappingRanges(e.right,t,r))}doRangesOverlap(e,t){return e.start<t.end&&t.start<e.end}removeNode(e,t){if(!e)return null;if(this.areRangesEqual(e.range,t)){if(!e.left)return e.right;if(!e.right)return e.left;let t=this.findMin(e.right);e.range=t.range,e.right=this.removeNode(e.right,t.range)}else t.start<e.range.start?e.left=this.removeNode(e.left,t):e.right=this.removeNode(e.right,t);return e.max=e.range.end,e.left&&(e.max=this.bigintMax(e.max,e.left.max)),e.right&&(e.max=this.bigintMax(e.max,e.right.max)),e}findMin(e){let t=e;for(;t.left;)t=t.left;return t}areRangesEqual(e,t){return e.start===t.start&&e.end===t.end&&e.pid===t.pid&&e.fd===t.fd}findLocksForProcessInNode(e,t,r){e&&(e.range.pid===t&&r.push(e.range),this.findLocksForProcessInNode(e.left,t,r),this.findLocksForProcessInNode(e.right,t,r))}},FileLockManagerInMemory=class{constructor(){this.locks=new Map}lockWholeFile(e,t){if(this.locks.get(e)===void 0){if(t.type===`unlock`)return!0;this.locks.set(e,new FileLock)}let r=this.locks.get(e).lockWholeFile(t);return this.forgetPathIfUnlocked(e),r}lockFileByteRange(e,t){if(!this.locks.has(e)){if(t.type===`unlocked`)return!0;this.locks.set(e,new FileLock)}return this.locks.get(e).lockFileByteRange(t)}findFirstConflictingByteRangeLock(e,t){let r=this.locks.get(e);if(r!==void 0)return r.findFirstConflictingByteRangeLock(t)}releaseLocksForProcess(e){for(let[t,r]of this.locks.entries())r.releaseLocksForProcess(e),this.forgetPathIfUnlocked(t)}releaseLocksOnFdClose(e,t,r){let i=this.locks.get(r);i&&(i.releaseLocksOnFdClose(e,t),this.forgetPathIfUnlocked(r))}forgetPathIfUnlocked(e){let t=this.locks.get(e);t&&t.isUnlocked()&&this.locks.delete(e)}},FileLock=class{constructor(){this.rangeLocks=new FileLockIntervalTree,this.wholeFileLock={type:`unlocked`}}lockWholeFile(e){if(e.type===`unlock`)return this.wholeFileLock.type===`unlocked`||(this.wholeFileLock.type===`exclusive`&&this.wholeFileLock.pid===e.pid&&this.wholeFileLock.fd===e.fd?this.wholeFileLock={type:`unlocked`}:this.wholeFileLock.type===`shared`&&this.wholeFileLock.pidFds.has(e.pid)&&this.wholeFileLock.pidFds.get(e.pid).has(e.fd)&&(this.wholeFileLock.pidFds.get(e.pid).delete(e.fd),this.wholeFileLock.pidFds.get(e.pid).size===0&&this.wholeFileLock.pidFds.delete(e.pid),this.wholeFileLock.pidFds.size===0&&(this.wholeFileLock={type:`unlocked`}))),!0;if(this.isThereAConflictWithRequestedWholeFileLock(e))return!1;if(e.type===`exclusive`)return this.wholeFileLock={type:`exclusive`,pid:e.pid,fd:e.fd},!0;if(e.type===`shared`){this.wholeFileLock.type!==`shared`&&(this.wholeFileLock={type:`shared`,pidFds:new Map});let t=this.wholeFileLock;return t.pidFds.has(e.pid)||t.pidFds.set(e.pid,new Set),t.pidFds.get(e.pid).add(e.fd),!0}throw Error(`Unexpected wholeFileLock() op: '${e.type}'`)}lockFileByteRange(e){if(e.start===e.end&&(e={...e,end:MAX_ADDRESSABLE_FILE_OFFSET}),e.type===`unlocked`){let t=this.rangeLocks.findOverlapping(e).filter(t=>t.pid===e.pid);for(let r of t)this.rangeLocks.remove(r),r.start<e.start&&this.rangeLocks.insert({...r,end:e.start}),r.end>e.end&&this.rangeLocks.insert({...r,start:e.end});return!0}if(this.isThereAConflictWithRequestedRangeLock(e))return!1;let t=this.rangeLocks.findOverlapping(e).filter(t=>t.pid===e.pid),r=e.start,i=e.end;for(let e of t)this.rangeLocks.remove(e),e.start<r&&(r=e.start),e.end>i&&(i=e.end);let a={...e,start:r,end:i};return this.rangeLocks.insert(a),!0}findFirstConflictingByteRangeLock(e){e.start===e.end&&(e={...e,end:MAX_ADDRESSABLE_FILE_OFFSET});let t=this.rangeLocks.findOverlapping(e).find(t=>t.pid!==e.pid&&(e.type===`exclusive`||t.type===`exclusive`));if(t)return t;if(this.wholeFileLock.type!==`unlocked`&&(this.wholeFileLock.type===`exclusive`||e.type===`exclusive`))return{type:this.wholeFileLock.type,start:0n,end:0n,pid:-1}}releaseLocksForProcess(e){for(let t of this.rangeLocks.findLocksForProcess(e))this.lockFileByteRange({...t,type:`unlocked`});if(this.wholeFileLock.type===`exclusive`&&this.wholeFileLock.pid===e)this.lockWholeFile({pid:e,fd:this.wholeFileLock.fd,type:`unlock`});else if(this.wholeFileLock.type===`shared`&&this.wholeFileLock.pidFds.has(e))for(let t of this.wholeFileLock.pidFds.get(e))this.lockWholeFile({pid:e,fd:t,type:`unlock`})}releaseLocksOnFdClose(e,t){for(let t of this.rangeLocks.findLocksForProcess(e))this.lockFileByteRange({...t,type:`unlocked`});this.lockWholeFile({pid:e,fd:t,type:`unlock`})}isUnlocked(){return this.wholeFileLock.type===`unlocked`&&this.rangeLocks.isEmpty()}isThereAConflictWithRequestedRangeLock(e){return this.findFirstConflictingByteRangeLock(e)!==void 0}isThereAConflictWithRequestedWholeFileLock(e){return e.type===`exclusive`?!!(this.wholeFileLock.type===`exclusive`&&(this.wholeFileLock.fd!==e.fd||this.wholeFileLock.pid!==e.pid)||this.wholeFileLock.type===`shared`&&Array.from(this.wholeFileLock.pidFds).some(([t,r])=>t!==e.pid||Array.from(r).some(t=>t!==e.fd))||this.rangeLocks.findOverlapping({start:0n,end:MAX_ADDRESSABLE_FILE_OFFSET}).length>0):e.type===`shared`?this.wholeFileLock.type===`exclusive`&&(this.wholeFileLock.pid!==e.pid||this.wholeFileLock.fd!==e.fd)||this.rangeLocks.findOverlapping({start:0n,end:MAX_ADDRESSABLE_FILE_OFFSET}).filter(e=>e.type===`exclusive`).length>0:!1}},FileLockManagerComposite=class{constructor({nativeLockManager:e,wasmLockManager:t}){this.nativeLockManager=e,this.wasmLockManager=t}lockWholeFile(e,t){if(t.type!==`unlock`){let r,i;try{if(r=this.nativeLockManager.lockWholeFile(e,t),!r)return!1;i=this.wasmLockManager.lockWholeFile(e,t)}catch(e){T$1.error(`Unexpected error in lockWholeFile()`,e)}finally{r&&!i&&this.nativeLockManager.lockWholeFile(e,{...t,type:`unlock`})}return!!r&&!!i}try{this.wasmLockManager.lockWholeFile(e,t)}catch(e){T$1.error(`Unexpected error unlocking whole file with in-memory lock manager`,e)}try{this.nativeLockManager.lockWholeFile(e,t)}catch(e){T$1.error(`Unexpected error unlocking whole file with native lock manager`,e)}return!0}lockFileByteRange(e,t,r){if(t.type!==`unlocked`){let i,a;try{if(i=this.nativeLockManager.lockFileByteRange(e,t,r),!i)return!1;a=this.wasmLockManager.lockFileByteRange(e,t,r)}catch(e){T$1.error(`Unexpected error in lockFileByteRange()`,e)}finally{i&&!a&&this.nativeLockManager.lockFileByteRange(e,{...t,type:`unlocked`},!1)}return!!i&&!!a}try{this.wasmLockManager.lockFileByteRange(e,t,r)}catch(e){T$1.error(`Unexpected error unlocking byte range with in-memory lock manager`,e)}try{this.nativeLockManager.lockFileByteRange(e,t,r)}catch(e){T$1.error(`Unexpected error unlocking byte range with native lock manager`,e)}return!0}findFirstConflictingByteRangeLock(e,t){try{return this.nativeLockManager.findFirstConflictingByteRangeLock(e,t)||this.wasmLockManager.findFirstConflictingByteRangeLock(e,t)}catch(e){T$1.error(`Unexpected error in findFirstConflictingByteRangeLock()`,e);return}}releaseLocksForProcess(e){try{this.wasmLockManager.releaseLocksForProcess(e)}catch(e){T$1.error(`Unexpected error in wasmLockManager.releaseLocksForProcess()`,e)}try{this.nativeLockManager.releaseLocksForProcess(e)}catch(e){T$1.error(`Unexpected error in nativeLockManager.releaseLocksForProcess()`,e)}}releaseLocksOnFdClose(e,t,r){try{this.wasmLockManager.releaseLocksOnFdClose(e,t,r)}catch(e){T$1.error(`Unexpected error in wasmLockManager.releaseLocksOnFdClose()`,e)}try{this.nativeLockManager.releaseLocksOnFdClose(e,t,r)}catch(e){T$1.error(`Unexpected error in nativeLockManager.releaseLocksOnFdClose()`,e)}}};function createObjectPoolProxy(e){if(e.length===0)throw Error(`At least one instance is required`);let t=[...e],r=[];function i(){let e=t.shift();return e===void 0?new Promise(e=>{r.push(e)}):Promise.resolve(e)}function a(e){let i=r.shift();i?i(e):t.push(e)}function s(e){return i().then(t=>{let r=e=>{let r=e?.finished;return r&&typeof r.then==`function`?Promise.resolve(r).then(()=>a(t),()=>a(t)):a(t),e},i;try{i=e(t)}catch(e){throw a(t),e}return i!=null&&typeof i.then==`function`?i.then(e=>r(e),e=>{throw a(t),e}):r(i)})}return new Proxy({},{get(e,t){if(t in e)return e[t];if(t!==`then`)return new Proxy(function(){},{apply(e,r,i){return s(e=>e[t](...i))},get(e,r){if(r===`then`)return(e,r)=>s(e=>e[t]).then(e,r)}})}})}var maxValueForSigned32BitInteger=2**31-1,ProcessIdAllocator=class{constructor(e=1,t=maxValueForSigned32BitInteger){this.claimed=new Set,this.initialId=e,this.maxId=t,this.nextId=e}claim(){let e=this.maxId-this.initialId+1;for(let t=0;t<e;t++)if(this.claimed.has(this.nextId))this.nextId++,this.nextId>this.maxId&&(this.nextId=this.initialId);else return this.claimed.add(this.nextId),this.nextId;throw Error(`Unable to find free process ID after ${e} tries.`)}release(e){return this.claimed.has(e)?(this.claimed.delete(e),!0):!1}},jspi=()=>(async()=>`Suspending`in WebAssembly)();async function getPHPLoaderModule(){return await jspi()?await __vitePreload(()=>import(`./php_7_4-DQhoJhDq.js`),__vite__mapDeps([2,1])):await __vitePreload(()=>import(`./php_7_4-59u1H5Gs.js`),__vite__mapDeps([3,1]))}var mysql_default=`<?php
// mod_php ran each script from its own directory, so Poster's bare includes resolve there.
if (!empty($_SERVER['SCRIPT_FILENAME'])) chdir(dirname($_SERVER['SCRIPT_FILENAME']));

define('MYSQL_ASSOC', PDO::FETCH_ASSOC);
define('MYSQL_NUM', PDO::FETCH_NUM);
define('MYSQL_BOTH', PDO::FETCH_BOTH);

final class MysqlShimResult {
	public $rows;
	public $pos = 0;
	public function __construct(array $rows) { $this->rows = $rows; }
}

final class MysqlShim {
	public static $db;
	public static $error = '';
	public static $errno = 0;
	public static $affected = 0;

	public static function db() {
		if (!self::$db) {
			self::$db = new PDO('sqlite:/db/poster.sqlite');
			self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		return self::$db;
	}

	// MySQL treats backslash as an escape inside string literals; SQLite does not.
	public static function translate($sql) {
		return preg_replace_callback("/'((?:[^'\\\\\\\\]|\\\\\\\\.|'')*)'/s", function ($m) {
			$s = preg_replace_callback("/\\\\\\\\(.)|''/s", function ($e) {
				$map = array('n' => "\\n", 'r' => "\\r", 't' => "\\t", '0' => "\\0", 'Z' => "\\x1a");
				if (!isset($e[1])) return "'";
				return isset($map[$e[1]]) ? $map[$e[1]] : $e[1];
			}, $m[1]);
			return "'" . str_replace("'", "''", $s) . "'";
		}, $sql);
	}
}

function mysql_connect() { MysqlShim::db(); return true; }
function mysql_pconnect() { return mysql_connect(); }
function mysql_select_db() { return true; }
function mysql_close() { return true; }
function mysql_set_charset() { return true; }

function mysql_query($sql) {
	MysqlShim::$error = '';
	MysqlShim::$errno = 0;
	try {
		$stmt = MysqlShim::db()->query(MysqlShim::translate($sql));
	} catch (PDOException $e) {
		MysqlShim::$error = $e->getMessage();
		MysqlShim::$errno = 1064;
		return false;
	}
	if ($stmt->columnCount() > 0) {
		return new MysqlShimResult($stmt->fetchAll(PDO::FETCH_BOTH));
	}
	MysqlShim::$affected = $stmt->rowCount();
	return true;
}

function mysql_fetch_array($result, $type = MYSQL_BOTH) {
	if (!$result instanceof MysqlShimResult || $result->pos >= count($result->rows)) {
		return false;
	}
	$row = $result->rows[$result->pos++];
	if ($type == MYSQL_BOTH) {
		return $row;
	}
	$out = array();
	foreach ($row as $k => $v) {
		if (is_int($k) === ($type == MYSQL_NUM)) {
			$out[$k] = $v;
		}
	}
	return $out;
}

function mysql_fetch_assoc($result) { return mysql_fetch_array($result, MYSQL_ASSOC); }
function mysql_fetch_row($result) { return mysql_fetch_array($result, MYSQL_NUM); }
function mysql_fetch_object($result) {
	$row = mysql_fetch_assoc($result);
	return $row === false ? false : (object) $row;
}

function mysql_num_rows($result) {
	return $result instanceof MysqlShimResult ? count($result->rows) : false;
}

function mysql_result($result, $row, $field = 0) {
	return isset($result->rows[$row][$field]) ? $result->rows[$row][$field] : false;
}

function mysql_data_seek($result, $row) { $result->pos = $row; return true; }
function mysql_free_result($result) { return true; }
function mysql_affected_rows() { return MysqlShim::$affected; }
function mysql_insert_id() { return (int) MysqlShim::db()->lastInsertId(); }
function mysql_error() { return MysqlShim::$error; }
function mysql_errno() { return MysqlShim::$errno; }
function mysql_real_escape_string($s) { return addslashes($s); }
function mysql_escape_string($s) { return addslashes($s); }
`,_7_default=`
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ \`7\` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE \`7\`;
DROP TABLE IF EXISTS \`posts\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE \`posts\` (
  \`user_id\` text NOT NULL,
  \`content\` text NOT NULL,
  \`timestamp\` int(11) NOT NULL,
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`deleted\` text NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES \`posts\` WRITE;
/*!40000 ALTER TABLE \`posts\` DISABLE KEYS */;
INSERT INTO \`posts\` VALUES ('3','yo yo',1436880577,1,'false'),('3','yo yo',1436881202,2,'false'),('3','why hello there',1436881462,3,'false'),('3','wazzup',1436881774,4,'false'),('3','cool?',1436881865,5,'false'),('6','man i am cool',1436881909,6,'false'),('6','hey',1436881917,7,'false'),('6','maybe',1436881924,8,'false'),('8','Hey Guys, wazzup',1440901807,9,'false');
/*!40000 ALTER TABLE \`posts\` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS \`users\`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE \`users\` (
  \`user\` text NOT NULL,
  \`password\` text NOT NULL,
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`vericode\` text NOT NULL,
  \`rank\` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES \`users\` WRITE;
/*!40000 ALTER TABLE \`users\` DISABLE KEYS */;
INSERT INTO \`users\` VALUES ('dylan','museum',0,'0',1),('admin','museum',3,'0',0),('Ptere','museum',4,'0',1),('admind','museum',5,'0',1),('logger123','museum',6,'0',1),('tokampchat','museum',7,'0',1),('peterpan1','museum',8,'0',1);
/*!40000 ALTER TABLE \`users\` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

`,site=Object.assign({"./site/admin/body.php":body_default$1,"./site/admin/global.php":global_default$1,"./site/admin/head.php":head_default$1,"./site/admin/index.php":admin_default,"./site/admin/update.php":update_default,"./site/admin/user.php":user_default$1,"./site/body.php":body_default,"./site/global.php":global_default,"./site/head.php":head_default,"./site/index.php":site_default,"./site/login.php":login_default,"./site/logout.php":logout_default,"./site/post.php":post_default,"./site/register.php":register_default,"./site/style.css":style_default,"./site/user.php":user_default,"./site/variables.php":variables_default}),ORIGIN=`http://poster.local`,view=document.getElementById(`view`),boot=document.getElementById(`boot`),Jar=class{cookies=new Map;rememberCookiesFromResponseHeaders(e){for(let t of e[`set-cookie`]??[]){let[e,...r]=t.split(`;`).map(e=>e.trim()),i=e.indexOf(`=`);if(i<1)continue;let a=e.slice(0,i),s=e.slice(i+1),O=e=>r.find(t=>t.toLowerCase().startsWith(e+`=`))?.slice(e.length+1),N=O(`max-age`),F=O(`expires`);(N===void 0?F!==void 0&&Date.parse(F)<=Date.now():Number(N)<=0)?this.cookies.delete(a):this.cookies.set(a,s)}}getCookieRequestHeader(){return[...this.cookies].map(([e,t])=>`${e}=${t}`).join(`; `)}};function sqliteSchema(e){return e.replace(/\/\*![\s\S]*?\*\/;?/g,``).split(`
`).filter(e=>!/^(LOCK|UNLOCK|CREATE DATABASE|USE )/.test(e)).join(`
`).replace(/int\(\d+\) NOT NULL AUTO_INCREMENT/g,`INTEGER NOT NULL`).replace(/int\(\d+\)/g,`INTEGER`).replace(/\btext NOT NULL/g,`text NOT NULL COLLATE NOCASE`).replace(/\)\s*ENGINE=[^;]*;/g,`);`)}async function start(){let e=new PHP(await loadPHPRuntime(await getPHPLoaderModule()));for(let[t,r]of Object.entries(site)){let i=`/www/`+t.slice(7);e.mkdirTree(i.slice(0,i.lastIndexOf(`/`))),e.writeFile(i,r)}return e.mkdirTree(`/internal/shared/preload`),e.mkdirTree(`/db`),e.writeFile(`/internal/shared/preload/mysql.php`,mysql_default),e.writeFile(`/db/schema.sql`,sqliteSchema(_7_default)),await e.run({code:`<?php (new PDO('sqlite:/db/poster.sqlite'))->exec(file_get_contents('/db/schema.sql'));`}),await setPhpIniEntries(e,{display_errors:`0`,error_reporting:`E_ALL & ~E_NOTICE & ~E_WARNING & ~E_DEPRECATED`}),{php:e,handler:new PHPRequestHandler({php:e,documentRoot:`/www`,absoluteUrl:ORIGIN,cookieStore:new Jar})}}var{php,handler}=await start(),current=`/index.php`;function refreshTarget(e){let t=new DOMParser().parseFromString(e,`text/html`).querySelector(`meta[http-equiv="refresh" i]`)?.getAttribute(`content`)?.match(/^\s*\d+\s*;\s*(?:url=)?(.*)$/i);return t?t[1].trim():null}function inlineStyles(e,t){return e.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)"\s*\/?>/gi,(e,r)=>{let i=`/www`+new URL(r,t).pathname;return php.fileExists(i)?`<style>${php.readFileAsText(i)}</style>`:e})}async function go(e,t=`GET`,r){for(let i=0;i<10;i++){let i=new URL(e,ORIGIN+current);current=i.pathname+i.search;let a=await handler.request({url:current,method:t,body:r===void 0?void 0:new TextEncoder().encode(r),headers:r===void 0?{}:{"content-type":`application/x-www-form-urlencoded`}});a.errors&&console.warn(current,a.errors),t=`GET`,r=void 0;let s=a.headers.location?.[0],O=a.httpStatusCode>=300&&a.httpStatusCode<400&&s?s:refreshTarget(a.text);if(O!==null)e=O;else{view.srcdoc=inlineStyles(a.text,i),boot.remove();return}}}view.addEventListener(`load`,()=>{let e=view.contentDocument;e&&(e.addEventListener(`click`,e=>{let t=e.target.closest?.(`a[href]`);t&&(e.preventDefault(),go(t.getAttribute(`href`)))}),e.addEventListener(`submit`,e=>{e.preventDefault();let t=e.target,r=t.getAttribute(`action`)||current,i=new URLSearchParams(new FormData(t,e.submitter)).toString();t.method.toLowerCase()===`post`?go(r,`POST`,i):go(r.split(`?`)[0]+`?`+i)}))}),go(current);