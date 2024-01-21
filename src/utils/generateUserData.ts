function generateUserData(firstName: string, secondName: string) {
  return {
    avatarPhoto: `https://ui-avatars.com/api/?name=${firstName}+${secondName}`,
  };
}


export default generateUserData;