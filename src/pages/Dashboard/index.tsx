import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';

import { Container, Header, Profile, HeaderContent, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import logo from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

interface Appointment {
    id: string;
    user: {
        name: string;
        avatar_url: string;
    };
    date: string;
    formattedHour: string;
}

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    let dayOfWeek: string = '';

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);
        }
    },[]);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            },
        }).then(response => {
            setMonthAvailability(response.data);
        })
    }, [currentMonth, user.id]);

    useEffect(() => {
        api.get<Appointment[]>(`/appointments/me`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {...appointment, 
                    formattedHour: format(parseISO(appointment.date), 'HH:mm'),
                };
            });
            setAppointments(appointmentsFormatted);
        });
    }, [selectedDate]);

    const disabledDays = useMemo(() => {
        const dates = monthAvailability.filter(monthDay => monthDay.available === false).map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            return new Date(year, month, monthDay.day);
        });

        return dates;
    }, [currentMonth, monthAvailability]);//memorizar valor específico e dizer quando ele deve ser recarregado

    if (selectedDate.getDay() === 0){
        dayOfWeek = 'Domingo';
    } else if (selectedDate.getDay() === 1) {
        dayOfWeek = 'Segunda-feira';
    } else if (selectedDate.getDay() === 2) {
        dayOfWeek = 'Terça-feira';
    } else if (selectedDate.getDay() === 3) {
        dayOfWeek = 'Quarta-feira';
    } else if (selectedDate.getDay() === 4) {
        dayOfWeek = 'Quinta-feira';
    } else if (selectedDate.getDay() === 5) {
        dayOfWeek = 'Sexta-feira';
    } else if (selectedDate.getDay() === 6) {
        dayOfWeek = 'Sábado';
    }

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
        locale: ptBR 
    });
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    }, [appointments]);

    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(appointment =>
            isAfter(parseISO(appointment.date), new Date()),
        );
    }, [appointments]);


    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logo} alt=""/>

                    <Profile>
                        <img src={user.avatar_url} alt={user.name}/>
                        <div>
                            <span>Bem vindo, </span>
                            <Link to="/profile"><strong>{user.name}</strong></Link>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower/>
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{dayOfWeek}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment && (
                    <NextAppointment>
                        <strong>Próximo agendamento</strong>
                        <div>
                            <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name}/>

                            <strong>{nextAppointment.user.name}</strong>
                            <span>
                                <FiClock/>
                                {nextAppointment.formattedHour}
                            </span>
                        
                        </div>
                    </NextAppointment>
                    )}

                    <Section>
                        <strong>Manhã</strong>

                        {morningAppointments.length === 0 && (
                            <p>Nenhum agendamento neste período.</p>
                        )}

                        {morningAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock/>
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        {afternoonAppointments.length === 0 && (
                            <p>Nenhum agendamento neste período.</p>
                        )}

                        {afternoonAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock/>
                                    {appointment.formattedHour}
                                </span>

                                <div>
                                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker 
                        weekdaysShort={[ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb',]}
                        months={[ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',]}
                        fromMonth={new Date()}
                        disabledDays={[ {daysOfWeek: [0, 6]}, ...disabledDays ]} //sabado e domingo
                        modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5]}}}
                        onDayClick={handleDateChange}
                        selectedDays={selectedDate}
                        onMonthChange={handleMonthChange}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};
export default Dashboard;
