import Input from './ui/Input';
import Button from './ui/Button';

const LoginForm = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) => (
  <form onSubmit={handleSubmit} className="mt-3 space-y-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Email address:
      </label>
      <Input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Password:
      </label>
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <Button
      type="submit"
      variant="primary"
      disabled={!email || !password}
      className="w-full"
    >
      Submit
    </Button>
  </form>
);

export default LoginForm;
