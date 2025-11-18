const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB 연결 성공\n');

    const users = await User.find({}).select('email name role');
    
    console.log('📋 데이터베이스에 저장된 사용자 목록:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} (${user.role})`);
    });
    
    console.log(`\n총 ${users.length}명의 사용자\n`);
    
    // 특정 사용자 테스트
    const testUser = await User.findOne({ email: 'test1@gmail.com' });
    if (testUser) {
      console.log('✅ test1@gmail.com 사용자 찾음');
      const isMatch = await testUser.comparePassword('123456');
      console.log(`비밀번호 '123456' 일치 여부: ${isMatch}`);
    } else {
      console.log('❌ test1@gmail.com 사용자를 찾을 수 없음');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러:', error);
    process.exit(1);
  }
};

checkUsers();
