import uuid from '@/common/uuid'

describe('uuid', () => {

  it('should be able to generate uuids', () => {
    expect(uuid()).to.be.not.null
  })

})
