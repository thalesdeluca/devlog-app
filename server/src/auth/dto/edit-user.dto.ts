export class EditUserDto {
  readonly name: string;
  readonly email: string;
  readonly oldPassword: string;
  readonly newPassword: string;
}