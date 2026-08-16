import bcrypt from 'bcrypt'



export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => { 
  const ismatched= await bcrypt.compare(password, hashedPassword);
    return ismatched;
}