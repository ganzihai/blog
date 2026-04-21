/* https://blog.baoshuo.ren/post/darkmode/ */
const rootElement = document.documentElement;
const darkModeClassName = "dark";
const darkModeStorageKey = "user-color-scheme";
const darkModeTimeKey = "user-color-scheme-time";
const validColorModeKeys = { dark: true, light: true };
const invertDarkModeObj = { dark: "light", light: "dark" };

/**
 * Set a key's value in LocalStorage
 * @param {String} key Key
 * @param {String} value Value
 */
const setLocalStorage = (key, value) => {
	try {
		localStorage.setItem(key, value);
	} catch (e) {}
};

/**
 * Remove a key in LocalStorage
 * @param {String} key Key
 */
const removeLocalStorage = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (e) {}
};

/**
 * Get a key's value in LocalStorage
 * @param {String} key Key
 * @returns {String} Value
 */
const getLocalStorage = (key) => {
	try {
		return localStorage.getItem(key);
	} catch (e) {
		return null;
	}
};

/**
 * Get system color mode preference
 * @returns {String} Mode
 */
const getModeFromCSSMediaQuery = () => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Reset DarkMode class and LocalStorage
 */
const resetRootDarkModeClassAndLocalStorage = () => {
	rootElement.classList.remove(darkModeClassName);
	rootElement.classList.remove(invertDarkModeObj[darkModeClassName]);
	removeLocalStorage(darkModeStorageKey);
};

/**
 * Apply a custom darkmode setting
 * @param {String} [mode] Mode
 */
const applyCustomDarkModeSettings = (mode) => {
	const currentSetting = mode || getLocalStorage(darkModeStorageKey);

	if (validColorModeKeys[currentSetting]) {
		rootElement.classList.add(currentSetting);
		rootElement.classList.remove(invertDarkModeObj[currentSetting]);
	} else {
		resetRootDarkModeClassAndLocalStorage();
	}
};

/**
 * Toggle DarkMode
 */
const toggleCustomDarkMode = () => {
	let currentSetting = getLocalStorage(darkModeStorageKey);

	if (validColorModeKeys[currentSetting]) {
		currentSetting = invertDarkModeObj[currentSetting];
	} else if (currentSetting === null) {
		// 没有存储值时，当前默认是 light，切换到 dark
		currentSetting = darkModeClassName;
	} else {
		return;
	}
	setLocalStorage(darkModeStorageKey, currentSetting);
	setLocalStorage(darkModeTimeKey, +new Date());

	return currentSetting;
};

/**
 * Init DarkMode
 * 默认始终使用明亮主题（light）
 * 如果用户曾手动切换过，读取 localStorage 里的偏好
 */
const initDarkMode = () => {
	const savedMode = getLocalStorage(darkModeStorageKey);

	if (validColorModeKeys[savedMode]) {
		// 用户曾手动切换过，尊重用户偏好
		applyCustomDarkModeSettings(savedMode);
	} else {
		// 首次访问或无记录，强制明亮主题
		applyCustomDarkModeSettings("light");
		setLocalStorage(darkModeStorageKey, "light");
	}
};

initDarkMode();
