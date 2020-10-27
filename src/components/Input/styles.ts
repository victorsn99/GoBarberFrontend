import styled, {css} from 'styled-components';
import Tooltip from '../Tooltip';

interface containerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
};

export const Container = styled.div<containerProps>`
      background: #232129;
      border-radius: 10px;
      border: 2px solid #232129;
      padding: 16px;
      width: 100%;
      color: #666360;

      display: flex;
      align-items: center;

      & + div {
        margin-top: 8px;
      }

      ${props => props.isFilled && css`
        color: #FF9000;
      `};

      ${props => props.isFocused && css`
      color: #FF9000;
      border-color: #FF9000;
      `};

      ${props => props.isErrored && css`
        border-color: #C53030;
      `};

      input {
        flex: 1;
        background: transparent;
        border: 0;
        color: #F4EDE8;

      &::placeholder {
        color: #666360;
      }


    }

    svg {
        margin-right: 16px;
      }
`;

export const Error = styled(Tooltip)`

    margin-left: 16px;
    height: 20px;
    svg {
        margin: 0;
      }

      span {
        background: #C53030;
        color: #FFF;

        &::before {
          border-color: #C53030 transparent;
        }
      }
`;


