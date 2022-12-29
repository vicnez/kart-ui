
export const setUserSession = (token, user) => {
	sessionStorage.setItem('token', token);
	//JSON.stringify - json to string conversion
	sessionStorage.setItem('user', JSON.stringify(user));
}

export const getUser = () => {
	const userDetails = sessionStorage.getItem('user');
	if(userDetails) return JSON.parse(userDetails);
	else return null;
}

export const removeUserSession = () => {
	sessionStorage.removeItem('token');
	sessionStorage.removeItem('user');
}

export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}