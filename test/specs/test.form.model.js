/* globals describe, it, expect */
import FormModel from '../../app/form/form.model';

describe('FormModel', () => {
  it('should be defined', () => {
    expect(FormModel).toBeDefined();
  });
  it('can be instantiated', () => {
    var course = new FormModel();
    expect(course).not.toBeNull();
  });
  it('should validate required attributes', () => {
    var form = new FormModel();
    expect(form.isValid(true)).toBe(false);
  });
  it('should validate email format', () => {
    var form = new FormModel({
      name: 'some user',
      email: 'fake',
      router: 'some address',
      street_number: 100
    });
    expect(form.isValid(true)).toBe(false);
  });
});
