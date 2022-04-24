import styled from 'styled-components';

export const Div2Children = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const Bold = styled.p`
  font-weight: bold;
  margin: 0;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const TextPadding = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const PushRight = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

export const NoUnderlineStyle = {
  textDecoration: 'none',
};

export const cursorPointer = {
  cursor: 'pointer',
};

export const FullScreenCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  width: 100%;
  top: 0;
`;

export const FullScreenDiv = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const FullScreenCenterFromHeader = styled.div`
  min-height: calc(100vh - 58px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const CartParent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(255px, 1fr));
  gap: 15px;
}
`;

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
`;

export const JustifyCenter = styled.div`
  display: flex;
  justify-content: center;
`;

export const noUnderlineBlackStyle = {
  textDecoration: 'none',
  color: 'black',
};

export const Divider = styled.hr`
  height: 1px;
  background: var(--gray4);
  margin: 0;
`;

export const RightCornerStyle = {
  position: 'absolute',
  top: 5,
  right: 5,
  color: '#d2e020',
  height: 25,
  width: 25,
};

export const Header = styled.p`
  padding-bottom: 5px;
  position: relative;
  margin: 0;
  display: inline-block;
  font-size: 16px;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background: var(--blue5);
    top: 100%;
    left: 0;
  }
`;
