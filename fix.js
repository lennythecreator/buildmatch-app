const fs = require('fs');

['app/index.tsx', 'app/(auth)/login.tsx', 'app/(auth)/register.tsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  content = content.replace(/href=\"\/\(tabs\)\/dashboard\"/g, 'href={"/(tabs)/dashboard" as any}');
  content = content.replace(/router\.replace\('\/\(tabs\)\/dashboard'\)/g, 'router.replace("/(tabs)/dashboard" as any)');
  fs.writeFileSync(f, content);
});
